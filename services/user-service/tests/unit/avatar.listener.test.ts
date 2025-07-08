import { describe, it, expect, beforeEach, vi } from 'vitest';
import { faker } from '@faker-js/faker';
import { UserAvatarProcessedListener } from '../../src/events/listener';
import { ProfileService } from '../../src/services/profile.service';

vi.mock('../../src/services/profile.service');

describe('UserAvatarProcessedListener', () => {
  let listener: UserAvatarProcessedListener;

  beforeEach(() => {
    vi.clearAllMocks();
    listener = new UserAvatarProcessedListener();
  });

  it('should call ProfileService.updateProfile with the correct data', async () => {
    const eventData = {
      userId: faker.string.uuid(),
      avatarUrls: {
        small: 'http://example.com/small.jpg',
        medium: 'http://example.com/medium.jpg',
        large: 'http://example.com/large.jpg',
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await listener.onMessage(eventData, null as any);

    expect(ProfileService.updateProfile).toHaveBeenCalledWith(
      eventData.userId,
      {
        avatarUrls: eventData.avatarUrls,
      }
    );
  });

  it('should not throw an error if ProfileService.updateProfile fails', async () => {
    const eventData = {
      userId: faker.string.uuid(),
      avatarUrls: { medium: 'url' },
    };

    const mockError = new Error('Database connection failed');
    vi.mocked(ProfileService.updateProfile).mockRejectedValue(mockError);

    await expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      listener.onMessage(eventData, null as any)
    ).resolves.not.toThrow();
  });
});
