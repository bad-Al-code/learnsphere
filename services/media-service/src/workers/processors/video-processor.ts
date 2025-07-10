import { Message } from '@aws-sdk/client-sqs';
import { IProcessor, S3EventInfo } from './ip-processor';
import path from 'node:path';
import os from 'node:os';
import fs from 'fs-extra';
import { TranscoderService } from '../../services/transcoder.service';
import { VideoProcessedPublisher } from '../../events/publisher';
import logger from '../../config/logger';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../../config/s3Client';

const processedBucket = process.env.AWS_PROCESSED_MEDIA_BUCKET!;

export class VideoProcessor implements IProcessor {
  public canProcess(metadata: Record<string, string | undefined>): boolean {
    return metadata.uploadType === 'video';
  }

  private async downloadFile(
    s3Info: S3EventInfo,
    tempDir: string
  ): Promise<string> {
    const localPath = path.join(tempDir, path.basename(s3Info.key));

    logger.info(
      `Downloading s3://${s3Info.bucket}/${s3Info.key} to ${localPath}`
    );

    const getCommand = new GetObjectCommand({
      Bucket: s3Info.bucket,
      Key: s3Info.key,
    });
    const response = await s3Client.send(getCommand);

    if (!response.Body) {
      throw new Error(`S3 object has no body`);
    }

    const writeStream = fs.createWriteStream(localPath);
    response.Body.transformToWebStream().pipeTo(
      new WritableStream({
        write(chunk) {
          writeStream.write(chunk);
        },
        close() {
          writeStream.end();
        },
      })
    );

    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => resolve(localPath));
      writeStream.on('error', reject);
    });
  }

  private getMimeType(filename: string): string {
    if (filename.endsWith('.m3u8')) return 'application/vnd.apple.mpegurl';
    if (filename.endsWith('.ts')) return 'video/mp2t';
    return 'application/octet-stream';
  }

  private async uploadDirectory(
    dirPath: string,
    s3KeyPrefix: string
  ): Promise<void> {
    const filesAndFolders = await fs.readdir(dirPath, { withFileTypes: true });
    logger.debug(
      `Uploading ${filesAndFolders.length} files from ${dirPath} to s3://${processedBucket}/${s3KeyPrefix}`
    );

    const uploadPromises = filesAndFolders.map(async (item) => {
      const localFilePath = path.join(dirPath, item.name);
      const s3Key = `${s3KeyPrefix}/${item.name}`;

      if (item.isDirectory()) {
        await this.uploadDirectory(localFilePath, s3Key);
      } else {
        const putCommand = new PutObjectCommand({
          Bucket: processedBucket,
          Key: s3Key,
          Body: fs.createReadStream(localFilePath),
          ContentType: this.getMimeType(item.name),
        });

        await s3Client.send(putCommand);
      }
    });

    await Promise.all(uploadPromises);

    logger.info(`Successfully uploaded all HLS files tp ${s3KeyPrefix}`);
  }

  public async process(
    message: Message,
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
      const rawVideoPath = await this.downloadFile(s3Info, tempRawDir);

      await TranscoderService.transcodeToHls({
        inputPath: rawVideoPath,
        outputDir: tempProcessedDir,
      });

      const s3OutputPrefix = `videos/${lessonId}`;
      await this.uploadDirectory(tempProcessedDir, s3OutputPrefix);

      const finalPlaylistUrl = `https://${processedBucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3OutputPrefix}/playlist.m3u8`;

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
