import { S3Client as AwsS3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
}
