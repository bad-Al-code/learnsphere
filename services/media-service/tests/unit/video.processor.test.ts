import { describe, it, expect, beforeEach, vi } from 'vitest';
import { faker } from '@faker-js/faker';
import fs from 'fs-extra';

import { S3ClientService } from '../../src/clients/s3.client';
import { VideoProcessedPublisher } from '../../src/events/publisher';
import { TranscodingService } from '../../src/services/transcoding.service';
import { VideoProcessor } from '../../src/workers/processors/video-processor';
import { MediaRepository } from '../../src/db/media.repository';

vi.mock('../../src/clients/s3.client');
vi.mock('../../src/services/transcoding.service');
vi.mock('../../src/events/publisher');
vi.mock('../../src/db/media.repository');
vi.mock('fs-extra');

describe('VideoProcessor', () => {
  let videoProcessor: VideoProcessor;

  beforeEach(() => {
    vi.clearAllMocks();
    videoProcessor = new VideoProcessor();
  });

  describe('canProcess()', () => {
    it('should return true if metadata uploadType is "video"', () => {
      expect(videoProcessor.canProcess({ uploadType: 'video' })).toBe(true);
    });

    it('should return false for other uploadTypes', () => {
      expect(videoProcessor.canProcess({ uploadType: 'avatar' })).toBe(false);
    });
  });

  describe('process()', () => {
    const s3Info = { bucket: 'raw-bucket', key: 'uploads/video.mp4' };
    const metadata = { uploadType: 'video', lessonId: faker.string.uuid() };

    it('should successfully process a video and update status accordingkly', async () => {
      vi.mocked(fs.ensureDir).mockResolvedValue(undefined);
      vi.mocked(fs.remove).mockResolvedValue(undefined);

      await videoProcessor.process(s3Info, metadata);

      expect(MediaRepository.updateByS3Key).toHaveBeenCalledWith(s3Info.key, {
        status: 'processing',
      });

      expect(MediaRepository.updateByS3Key).toHaveBeenCalledWith(s3Info.key, {
        status: 'completed',
        processedUrls: expect.objectContaining({ hls: expect.any(String) }),
      });

      const updateCalls = vi.mocked(MediaRepository.updateByS3Key).mock.calls;
      expect(updateCalls[0][1].status).toBe('processing');
      expect(updateCalls[1][1].status).toBe('completed');

      expect(fs.ensureDir).toHaveBeenCalledTimes(2);
      expect(S3ClientService.downloadFile).toHaveBeenCalledOnce();
      expect(TranscodingService.transcodeToHls).toHaveBeenCalledOnce();
      expect(S3ClientService.uploadDirectory).toHaveBeenCalledOnce();

      const publisherInstance = vi.mocked(VideoProcessedPublisher).mock
        .instances[0];
      expect(publisherInstance.publish).toHaveBeenCalledOnce();
      expect(publisherInstance.publish).toHaveBeenCalledWith(
        expect.objectContaining({ lessonId: metadata.lessonId })
      );

      expect(fs.remove).toHaveBeenCalledTimes(2);
    });

    it('should update status to failed and clean up files if transcoding fails', async () => {
      const mockError = new Error('FFmpeg failed!');
      vi.mocked(TranscodingService.transcodeToHls).mockRejectedValue(mockError);
      vi.mocked(fs.ensureDir).mockResolvedValue(undefined);
      vi.mocked(fs.remove).mockResolvedValue(undefined);

      await expect(videoProcessor.process(s3Info, metadata)).rejects.toThrow(
        mockError
      );

      expect(MediaRepository.updateByS3Key).toHaveBeenCalledWith(s3Info.key, {
        status: 'failed',
        errorMessage: mockError.message,
      });

      await expect(videoProcessor.process(s3Info, metadata)).rejects.toThrow(
        mockError
      );
      expect(fs.remove).toHaveBeenCalled();

      const publisherInstance = vi.mocked(VideoProcessedPublisher).mock
        .instances[0];
      expect(publisherInstance.publish).not.toHaveBeenCalled();
    });
  });
});
