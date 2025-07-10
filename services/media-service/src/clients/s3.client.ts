import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import fs from 'fs-extra';
import {
  GetObjectCommand,
  GetObjectTaggingCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import { env } from '../config/env';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
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
   *
   * @param bucket
   * @param key
   * @param tags
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
   *
   * @param bucket
   * @param key
   * @param localPath
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
   *
   * @param bucket
   * @param key
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
   *
   * @param filename
   * @returns
   */
  private static getMimeType(filename: string): string {
    if (filename.endsWith('.m3u8')) return 'application/vnd.apple.mpegurl';
    if (filename.endsWith('.ts')) return 'video/mp2t';
    return 'application/octet-stream';
  }

  /**
   *
   * @param bucket
   * @param key
   * @param buffer
   * @param contentType
   */
  public static async uploadBuffer(
    bucket: string,
    key: string,
    buffer: Buffer,
    contentType: string
  ): Promise<void> {
    const putCommand = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
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
}
