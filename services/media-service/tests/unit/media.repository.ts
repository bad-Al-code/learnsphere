import { faker } from '@faker-js/faker';
import { it, beforeEach, describe, expect } from 'vitest';

import { db } from '../../src/db';
import { mediaAssets } from '../../src/db/schema';
import { MediaRepository } from '../../src/db/media.repository';

beforeEach(async () => {
  await db.delete(mediaAssets);
});

describe('MediaRepository', () => {
  describe('create()', () => {
    it('should create a new media asset record successfully', async () => {
      const newAssetData = {
        s3Key: `uploads/avatars/${faker.string.uuid()}/avatar.jpg`,
        uploadType: 'avatar' as const,
        ownerUserId: faker.string.uuid(),
      };

      const createdAsset = await MediaRepository.create(newAssetData);
      expect(createdAsset).toBeDefined();
      expect(createdAsset.s3Key).toBe(newAssetData.s3Key);
      expect(createdAsset.status).toBe('uploading');
    });
  });

  describe('updateByS3Key()', () => {
    it('should update an existing media asset record', async () => {
      const s3Key = `uploads/videos/${faker.string.uuid()}/video.mp4`;
      await MediaRepository.create({
        s3Key,
        uploadType: 'video',
      });

      const updateData = {
        status: 'completed' as const,
        processedUrls: { hls: `http://test.com/test.m3u8` },
      };

      const updatedAsset = await MediaRepository.updateByS3Key(
        s3Key,
        updateData
      );
      expect(updatedAsset).toBeDefined();
      expect(updatedAsset?.s3Key).toBe(s3Key);
      expect(updatedAsset?.status).toBe('completed');
      expect(updatedAsset?.processedUrls).toEqual(updateData.processedUrls);
    });

    it('shold return null if no asset is found to update', async () => {
      const result = await MediaRepository.updateByS3Key('non-existent-key', {
        status: 'failed',
      });

      expect(result).toBeNull();
    });
  });
});
