import { beforeEach, describe, expect, it, vi } from 'vitest';
import { faker } from '@faker-js/faker';

import { AvatarProcessor } from '../../src/workers/processors/avatar-processor';
import { S3ClientService } from '../../src/clients/s3.client';
import { ImageClient } from '../../src/clients/image.client';
import {
  UserAvatarFailedPublisher,
  UserAvatarProcessedPublisher,
} from '../../src/events/publisher';

vi.mock('../../src/clients/s3.client');
vi.mock('../../src/clients/image.client');
vi.mock('../../src/events/publisher');

describe('AvatarProcessor', () => {
  let avatarProcessor: AvatarProcessor;

  beforeEach(() => {
    vi.clearAllMocks();
    avatarProcessor = new AvatarProcessor();
  });

  describe('canProcess()', () => {
    it('should return true if metadata uploadType is "avatar"', () => {
      const metadata = { uploadType: 'avatar' };
      expect(avatarProcessor.canProcess(metadata)).toBe(true);
    });

    it('should return false if metadata uploadType is not "avatar"', () => {
      const metadata = { uploadType: 'video' };
      expect(avatarProcessor.canProcess(metadata)).toBe(false);
    });
  });

  describe('process()', () => {
    const s3Info = { bucket: 'test-bucket', key: 'test-key.jpg' };
    const metadata = { uploadType: 'avatar', userId: faker.string.uuid() };

    it('should process the avatar successfully', async () => {
      const mockImageBuffer = Buffer.from('fake-image-data');

      vi.mocked(S3ClientService.downloadFileAsBuffer).mockResolvedValue(
        mockImageBuffer
      );

      const mockProcessedUrls = {
        small: 'url-s',
        medium: 'url-m',
        large: 'url-l',
      };

      vi.mocked(ImageClient.processAndUploadAvatar).mockResolvedValue(
        mockProcessedUrls
      );

      await avatarProcessor.process(s3Info, metadata);

      expect(S3ClientService.downloadFileAsBuffer).toHaveBeenCalledWith(
        s3Info.bucket,
        s3Info.key
      );
      expect(ImageClient.processAndUploadAvatar).toHaveBeenCalledWith(
        mockImageBuffer,
        metadata.userId
      );

      const mockSuccessPublisherInstance = vi.mocked(
        UserAvatarProcessedPublisher
      ).mock.instances[0];
      expect(mockSuccessPublisherInstance.publish).toHaveBeenCalledTimes(1);
      expect(mockSuccessPublisherInstance.publish).toHaveBeenCalledWith({
        userId: metadata.userId,
        avatarUrls: mockProcessedUrls,
      });

      const mockFailurePublisherInstance = vi.mocked(UserAvatarFailedPublisher)
        .mock.instances[0];
      expect(mockFailurePublisherInstance.publish).not.toHaveBeenCalled();
    });

    it('should publish a failure event of image processing failed', async () => {
      const mockError = new Error('Image processing Failed');

      vi.mocked(ImageClient.processAndUploadAvatar).mockRejectedValue(
        mockError
      );

      await expect(avatarProcessor.process(s3Info, metadata)).rejects.toThrow(
        mockError
      );

      const mockFailurePublisherInstance = vi.mocked(UserAvatarFailedPublisher)
        .mock.instances[0];
      expect(mockFailurePublisherInstance.publish).toHaveBeenCalledTimes(1);
      expect(mockFailurePublisherInstance.publish).toHaveBeenCalledWith({
        userId: metadata.userId,
        reason: mockError.message,
      });

      const mockSuccessPublisherInstance = vi.mocked(
        UserAvatarProcessedPublisher
      ).mock.instances[0];
      expect(mockSuccessPublisherInstance.publish).not.toHaveBeenCalled();
    });
  });
});
