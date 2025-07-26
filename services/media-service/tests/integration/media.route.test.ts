import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

import { app } from '../../src/app';
import { MediaService } from '../../src/services/media.service';

vi.mock('@/services/media.service', () => ({
  MediaService: {
    getUploadUrl: vi.fn(),
  },
}));

describe('Media Routes - Integration Tests', () => {
  describe('POST /api/media/request-upload-url', () => {
    it('should return a signed URL successfully when given valid data', async () => {
      const mockResponse = {
        signedUrl: 'http://s3.mock.url/upload-hear',
        key: 'mock-s3-key',
      };

      vi.mocked(MediaService.getUploadUrl).mockResolvedValue(mockResponse);

      const requestBody = {
        filename: 'test.jpg',
        uploadType: 'avatar',
        metadata: { userId: '121' },
      };

      const response = await request(app)
        .post('/api/media/request-upload-url')
        .send(requestBody)
        .expect(200);

      expect(response.body).toEqual(mockResponse);
      expect(MediaService.getUploadUrl).toHaveBeenCalledWith(requestBody);
    });

    it('should return 400 for invalid data (e.g., missing filename', async () => {
      const invalidBody = {
        uploadType: 'avatar',
        metadata: { userId: '121' },
      };

      await request(app)
        .post('/api/media/request-upload-url')
        .send(invalidBody)
        .expect(400);
    });
  });
});
