import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import logger from "../config/logger";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export interface UploadUrlParams {
  userId: string;
  filename: string;
  context?: { [key: string]: string };
}

export class MediaService {
  public static async getUploadUrl({
    userId,
    filename,
    context,
  }: UploadUrlParams) {
    const rawBucket = process.env.AWS_RAW_UPLOADS_BUCKET!;

    const key = `uploads/avatars/${userId}/${Date.now()}-${filename}`;
    logger.info(`Generating pre-signed URL for key: ${key}`);

    const command = new PutObjectCommand({
      Bucket: rawBucket,
      Key: key,
      Metadata: context ? { context: JSON.stringify(context) } : undefined,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });

    return { signedUrl, key };
  }
}
