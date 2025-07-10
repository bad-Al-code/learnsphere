import { describe, it, expect, beforeEach, vi } from 'vitest';
import { faker } from '@faker-js/faker';
import fs from 'fs-extra';

import { S3ClientService } from '../../src/clients/s3.client';
import { VideoProcessedPublisher } from '../../src/events/publisher';
import { TranscodingService } from '../../src/services/transcoding.service';
import { VideoProcessor } from '../../src/workers/processors/video-processor';

vi.mock('../../src/clients/s3.client');
vi.mock('../../src/services/transcoding.service');
vi.mock('../../src/events/publisher');
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

    it('should successfully process a video and clean up temp files', async () => {
      vi.mocked(fs.ensureDir).mockResolvedValue(undefined);
      vi.mocked(fs.remove).mockResolvedValue(undefined);

      await videoProcessor.process(s3Info, metadata);

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

    it('should clean up temp files even if transcoding fails', async () => {
      const mockError = new Error('FFmpeg failed!');
      vi.mocked(TranscodingService.transcodeToHls).mockRejectedValue(mockError);
      vi.mocked(fs.ensureDir).mockResolvedValue(undefined);
      vi.mocked(fs.remove).mockResolvedValue(undefined);

      await expect(videoProcessor.process(s3Info, metadata)).rejects.toThrow(
        mockError
      );
      expect(fs.remove).toHaveBeenCalledTimes(2);

      const publisherInstance = vi.mocked(VideoProcessedPublisher).mock
        .instances[0];
      expect(publisherInstance.publish).not.toHaveBeenCalled();
    });
  });
});
