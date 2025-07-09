import { Message } from "@aws-sdk/client-sqs";
import { S3Client } from "../clients/s3.client";

export interface S3EventInfo {
  bucket: string;
  key: string;
}

export interface ParsedS3Event {
  s3Info: S3EventInfo;
  metadata: Record<string, string>;
}

export class S3EventParser {
  /**
   * Parses an SQS message to extract S3 object info and its metadata tags.
   * @param message The SQS message
   * @returns The parsed S3 info and metadata.
   */
  public static async parse(message: Message): Promise<ParsedS3Event> {
    if (!message.Body) {
      throw new Error(`SQS message ${message.MessageId} has no body.`);
    }

    const body = JSON.parse(message.Body);
    const s3Record = body.Records[0].s3;

    const s3Info: S3EventInfo = {
      bucket: s3Record.bucket.name,
      key: decodeURIComponent(s3Record.object.key.replace(/\+/g, " ")),
    };

    const metadata = await S3Client.getObjectTags(s3Info.bucket, s3Info.key);

    return { s3Info, metadata };
  }
}
