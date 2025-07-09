import {
  S3Client as AwsS3Client,
  GetObjectCommand,
  GetObjectTaggingCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs-extra";

import { env } from "../config/env";

const s3 = new AwsS3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export class S3Client {
  /**
   * Generates a presinged URL that allows uploading an object to a bucket.
   * @param key The S3 object key (path).
   * @param metadata The metadat to attach as tags to the S3 object.
   * @returns A presigned URL string
   */
  public static async generatePresignedPutUrl(
    key: string,
    metadata: Record<string, string>
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: env.AWS_RAW_UPLOADS_BUCKET,
      Key: key,
      Tagging: new URLSearchParams(metadata).toString(),
    });

    return getSignedUrl(s3, command, { expiresIn: 600 });
  }

  /**
   * Download an object from an S3 bucket to a local file path.
   * @param bucket The S3 bucket name
   * @param key The S3 object key
   * @param localPath The destination path on the local filesystem,
   * @returns A promise that resolves when the download is complete
   */
  public static async downloadToFile(
    bucket: string,
    key: string,
    localPath: string
  ): Promise<void> {
    const getCommand = new GetObjectCommand({ Bucket: bucket, Key: key });
    const response = await s3.send(getCommand);
    if (!response.Body) {
      throw new Error(`S3 object has no body: s3://${bucket}/${key}`);
    }

    const writeStream = fs.createWriteStream(localPath);

    return new Promise((resolve, reject) => {
      response.Body?.transformToWebStream()
        .pipeTo(
          new WritableStream({
            write(chunk) {
              writeStream.write(chunk);
            },
            close() {
              writeStream.end();
              resolve();
            },
            abort(err) {
              reject(err);
            },
          })
        )
        .catch(reject);
    });
  }

  /**
   * Retrieves the tags for a given S3 object,
   * @param bucket The S3 bucket name
   * @param key The S3 object key
   * @returns A record of the object's tags.
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
      TagSet?.reduce((acc, tag) => {
        if (tag.Key && tag.Value) acc[tag.Key] = tag.Value;

        return acc;
      }, {} as Record<string, string>) || {}
    );
  }
}
