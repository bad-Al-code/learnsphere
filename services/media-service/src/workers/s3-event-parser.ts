import { Message } from '@aws-sdk/client-sqs';
import { S3ClientService } from '../clients/s3.client';

export interface S3EventInfo {
  bucket: string;
  key: string;
}

export interface ParsedMessage {
  s3Info: S3EventInfo;
  metadata: Record<string, string>;
}

export class S3EventParser {
  /**
   * Parse an SQS message, extracts S3 object info, and fetches its metadata tags.
   * @param message The raw SQS message
   * @returns A structured object with the S3 Info and metadata, or null if parsing fails.
   */
  public static async parse(message: Message): Promise<ParsedMessage | null> {
    try {
      const body = JSON.parse(message.Body!);
      if (!body.Records || !body.Records[0]?.s3) {
        return null;
      }

      const s3Record = body.Records[0].s3;

      const s3Info: S3EventInfo = {
        bucket: s3Record.bucket.name,
        key: decodeURIComponent(s3Record.object.key.replace(/\+/g, ' ')),
      };

      const metadata = await S3ClientService.getObjectTags(
        s3Info.bucket,
        s3Info.key
      );

      return { s3Info, metadata };
    } catch (_error) {
      return null;
    }
  }
}
