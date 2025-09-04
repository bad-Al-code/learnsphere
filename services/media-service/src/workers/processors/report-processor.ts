import { Parser } from 'json2csv';
import { S3ClientService } from '../../clients/s3.client';
import { env } from '../../config/env';
import logger from '../../config/logger';
import {
  ReportGenerationFailedPublisher,
  ReportGenerationSucceededPublisher,
} from '../../events/publisher';
import { StudentPerformance } from './ip-processor';

interface ReportJobPayload {
  jobId: string;
  requesterId: string;
  reportType: string;
  format: 'csv' | 'pdf';
  payload: StudentPerformance[];
}

export class ReportProcessor {
  private readonly successPublisher: ReportGenerationSucceededPublisher;
  private readonly failurePublisher: ReportGenerationFailedPublisher;

  constructor() {
    this.successPublisher = new ReportGenerationSucceededPublisher();
    this.failurePublisher = new ReportGenerationFailedPublisher();
  }

  public async process(data: ReportJobPayload): Promise<void> {
    logger.info(`Processing report generation job: ${data.jobId}`);

    try {
      if (data.reportType !== 'student_performance' || data.format !== 'csv') {
        throw new Error('Unsupported report type or format.');
      }

      if (!data.payload || data.payload.length === 0) {
        logger.warn(
          `Job ${data.jobId} has no data to process. Marking as successful with empty report.`
        );

        await this.successPublisher.publish({
          jobId: data.jobId,
          requesterId: data.requesterId,
          fileUrl: '',
          reportType: data.reportType,
          format: data.format,
        });
        return;
      }

      const json2csvParser = new Parser();
      const csv = json2csvParser.parse(data.payload);
      const fileBuffer = Buffer.from(csv, 'utf-8');

      const reportsBucket = env.AWS_PROCESSED_MEDIA_BUCKET;
      const fileKey = `reports/${data.requesterId}/${data.jobId}.csv`;

      await S3ClientService.uploadBuffer(
        reportsBucket,
        fileKey,
        fileBuffer,
        'text/csv',
        'private'
      );

      const downloadUrl = await S3ClientService.getPresignedDownloadUrl(
        reportsBucket,
        fileKey
      );

      await this.successPublisher.publish({
        jobId: data.jobId,
        requesterId: data.requesterId,
        fileUrl: downloadUrl,
        reportType: data.reportType,
        format: data.format,
      });

      logger.info(
        `Successfully processed and uploaded report for job: ${data.jobId}`
      );
    } catch (err) {
      const error = err as Error;
      logger.error(`Failed to process report job ${data.jobId}`, {
        error: error.message,
      });

      await this.failurePublisher.publish({
        jobId: data.jobId,
        requesterId: data.requesterId,
        reason: error.message,
      });
    }
  }
}
