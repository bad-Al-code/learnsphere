import { beforeEach, describe, expect, it } from 'vitest';
import { faker } from '@faker-js/faker';

import { NotificationRepository } from '../../src/db/notification.repository';
import { EmailOutboxRepository } from '../../src/db/email-outbox.repository';
import { db } from '../../src/db';
import { emailOutbox, notifications } from '../../src/db/schema';
import { eq } from 'drizzle-orm';

beforeEach(async () => {
  db.delete(notifications);
  db.delete(emailOutbox);
});

describe('NotificationRepository', () => {
  it('should create a notification and find it by recipient ID', async () => {
    const notification = {
      recipientId: faker.string.uuid(),
      type: 'TEST',
      content: 'Test',
    };

    await NotificationRepository.create(notification);

    const result = await NotificationRepository.findByRecipientId(
      notification.recipientId,
      10,
      0
    );
    expect(result).toHaveLength(1);
    expect(result[0].content).toBe(notification.content);
    expect(result[0].type).toBe(notification.type);
  });
});

describe('EmailOutboxRepository', () => {
  it('should create a new email log entry', async () => {
    const newLog = {
      recipient: faker.internet.email(),
      subject: 'Test Subject',
      type: 'TEST',
      status: 'sent' as const,
    };

    await EmailOutboxRepository.create(newLog);

    const result = await db
      .select()
      .from(emailOutbox)
      .where(eq(emailOutbox.recipient, newLog.recipient));
    expect(result[0].subject).toBe(newLog.subject);
    expect(result[0].type).toBe(newLog.type);
  });
});
