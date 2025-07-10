import path from 'node:path';
import os from 'node:os';
import fs from 'fs-extra';

import { IProcessor, S3EventInfo } from './ip-processor';
import { TranscoderService } from '../../controllers/transcoder.service';
import { VideoProcessedPublisher } from '../../events/publisher';
import logger from '../../config/logger';
import { S3ClientService } from '../../clients/s3.client';
import { env } from '../../config/env';

const processedBucket = env.AWS_PROCESSED_MEDIA_BUCKET!;

export class VideoProcessor implements IProcessor {
  public canProcess(metadata: Record<string, string | undefined>): boolean {
    return metadata.uploadType === 'video';
  }

  public async process(
    s3Info: S3EventInfo,
    metadata: Record<string, string | undefined>
  ): Promise<void> {
    const lessonId = metadata.lessonId;
    if (!lessonId) {
      throw new Error(`VideoProcess called without a lessonId in metadata`);
    }

    const tempRawDir = path.join(
      os.tmpdir(),
      `learnsphere-raw-${lessonId}-${Date.now()}`
    );
    const tempProcessedDir = path.join(
      os.tmpdir(),
      `learnsphere-processed-${lessonId}-${Date.now()}`
    );

    await fs.ensureDir(tempRawDir);
    await fs.ensureDir(tempProcessedDir);

    try {
      const localRawVideoPath = path.join(
        tempRawDir,
        path.basename(s3Info.key)
      );

      await S3ClientService.downloadFile(
        s3Info.bucket,
        s3Info.key,
        localRawVideoPath
      );

      await TranscoderService.transcodeToHls({
        inputPath: localRawVideoPath,
        outputDir: tempProcessedDir,
      });

      const s3OutputPrefix = `videos/${lessonId}`;
      await S3ClientService.uploadDirectory(
        tempProcessedDir,
        processedBucket,
        s3OutputPrefix
      );

      const finalPlaylistUrl = `https://${processedBucket}.s3.${env.AWS_REGION}.amazonaws.com/${s3OutputPrefix}/playlist.m3u8`;

      const publisher = new VideoProcessedPublisher();
      await publisher.publish({
        lessonId: lessonId,
        videoUrl: finalPlaylistUrl,
      });
    } catch (error) {
      logger.error(`Failed to process video for lesson ${lessonId}`, { error });

      throw error;
    } finally {
      await fs.remove(tempRawDir);
      await fs.remove(tempProcessedDir);

      logger.debug(`Cleaned up temporary directions for lesson ${lessonId}`);
    }
  }
}
