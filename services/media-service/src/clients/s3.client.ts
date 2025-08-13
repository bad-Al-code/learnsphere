import {
  GetObjectCommand,
  GetObjectTaggingCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import fs from 'fs-extra';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../config/env';
import logger from '../config/logger';

export const s3 = new S3Client({
  region: env.AWS_REGION!,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
  },
});

export class S3ClientService {
  /**
   * Generate a secure, time-limited URL for uploading a file directly to S3.
   * @param bucket Tne name of the bucket to upload to
   * @param key The full object key (path) for the file in S3
   * @param tags A record of tags to attach to the S3 object upon upload
   * @returns A promise that resolves to the presigned URL string.
   */
  public static async getPresignedUploadUrl(
    bucket: string,
    key: string,
    tags: Record<string, string>
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Tagging: new URLSearchParams(tags).toString(),
    });

    const signedUrlExpiresIn = 600;
    return getSignedUrl(s3, command, { expiresIn: signedUrlExpiresIn });
  }

  /**
   * Downloads a file from S3 to a local temporary file path
   * @param bucket The S3 bucket name
   * @param key The S3 object key
   * @param localPath the absolute local path to save the downloaded file to
   */
  public static async downloadFile(
    bucket: string,
    key: string,
    localPath: string
  ): Promise<void> {
    logger.info(`Downloading s3://${bucket}/${key} to ${localPath}`);

    const getCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const response = await s3.send(getCommand);

    if (!response.Body) {
      throw new Error(`S3 object s3://${bucket}/${key} has no body.`);
    }

    const writeStream = fs.createWriteStream(localPath);
    await pipeline(response.Body as NodeJS.ReadableStream, writeStream);

    logger.info(`Successfully downloaded file to ${localPath}`);
  }

  /**
   * Uploads an entire local directory recursively to a specified S3 prefix
   * @param localDirPath The absolute path to the local directory to upload
   * @param bucket The destination S3 bucket
   * @param s3KeyPrefix The prefix (folder) in S3 to upload the contents to
   */
  public static async uploadDirectory(
    localDirPath: string,
    bucket: string,
    s3KeyPrefix: string
  ): Promise<void> {
    const files = await fs.readdir(localDirPath);
    logger.info(
      `Uploading ${files.length} files from ${localDirPath} to s3://${bucket}/${s3KeyPrefix}`
    );

    const uploadPromises = files.map(async (file) => {
      const localFilePath = path.join(localDirPath, file);
      const fileKey = `${s3KeyPrefix}/${file}`;

      const stat = await fs.stat(localFilePath);
      if (stat.isDirectory()) {
        return this.uploadDirectory(localFilePath, bucket, fileKey);
      }

      const putCommand = new PutObjectCommand({
        Bucket: bucket,
        Key: fileKey,
        Body: fs.createReadStream(localFilePath),
        ContentType: this.getMimeType(file),
      });

      await s3.send(putCommand);
    });

    await Promise.all(uploadPromises);

    logger.info(`Successfully uploaded all files to ${s3KeyPrefix}`);
  }

  /**
   * Fetches the tags associated with a specific S3 object,
   * @param bucket The S3 bucket name
   * @param key The S3 object key
   * @returns A key-value record of the object's tag
   */
  public static async getObjectTags(
    bucket: string,
    key: string
  ): Promise<Record<string, string>> {
    const getTagsCommand = new GetObjectTaggingCommand({
      Bucket: bucket,
      Key: key,
    });
    const { TagSet } = await s3.send(getTagsCommand);

    return (
      TagSet?.reduce(
        (acc, tag) => {
          if (tag.Key && tag.Value) acc[tag.Key] = tag.Value;
          return acc;
        },
        {} as Record<string, string>
      ) || {}
    );
  }

  /**
   * Uploads a buffer directly to S3.
   * @param bucket - The S3 bucket name.
   * @param key - The S3 object key.
   * @param buffer - The buffer containing the file data to upload.
   * @param contentType - The MIME type of the content (e.g., 'image/jpeg').
   */
  public static async uploadBuffer(
    bucket: string,
    key: string,
    buffer: Buffer,
    contentType: string,
    acl: 'public-read' | 'private' = 'private'
  ): Promise<void> {
    const putCommand = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: acl,
    });

    await s3.send(putCommand);
  }

  /**
   *
   * @param bucket
   * @param key
   * @returns
   */
  public static async downloadFileAsBuffer(
    bucket: string,
    key: string
  ): Promise<Buffer> {
    logger.info(`Downloading s3://${bucket}/${key} as buffer`);

    const getCommand = new GetObjectCommand({ Bucket: bucket, Key: key });
    const response = await s3.send(getCommand);

    if (!response.Body) {
      throw new Error(`S3 object s3://${bucket}/${key} has no body`);
    }

    const byteArray = await response.Body.transformToByteArray();

    return Buffer.from(byteArray);
  }

  /**
   * Determing the MIME type of a file based on its extension
   * @param filename The name of file based on its extension
   * @returns A string representing the content type
   */
  private static getMimeType(filename: string): string {
    if (filename.endsWith('.m3u8')) return 'application/vnd.apple.mpegurl';
    if (filename.endsWith('.ts')) return 'video/mp2t';
    return 'application/octet-stream';
  }
}
