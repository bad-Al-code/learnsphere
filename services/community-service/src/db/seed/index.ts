import { faker } from '@faker-js/faker';
import { db, pool } from '..';
import logger from '../../config/logger';
import {
  conversationParticipants,
  conversations,
  messages,
  users,
} from '../schema';

const specificUsers = [
  {
    id: '5bdb6c2f-10bc-439d-9740-aadacb7bae46',
    name: 'Francis Goodwin',
    avatarUrl: faker.image.avatarGitHub(),
  },
  {
    id: 'b06531a1-2563-4702-8706-819ce72649ac',
    name: 'Kelvin Thompson',
    avatarUrl: faker.image.avatarGitHub(),
  },
];

async function seed() {
  logger.info('Clearing existing data...');
  await db.delete(messages);
  await db.delete(conversationParticipants);
  await db.delete(conversations);
  await db.delete(users);

  await db.insert(users).values(specificUsers).onConflictDoNothing();

  const [conversation] = await db
    .insert(conversations)
    .values({ type: 'direct' })
    .returning();

  await db.insert(conversationParticipants).values([
    { conversationId: conversation.id, userId: specificUsers[0].id },
    { conversationId: conversation.id, userId: specificUsers[1].id },
  ]);

  const mockMessages = [];
  for (let i = 0; i < 20; i++) {
    const sender = i % 2 === 0 ? specificUsers[0] : specificUsers[1];

    const createdAt = faker.date.recent({ days: 2, refDate: new Date() });

    createdAt.setSeconds(createdAt.getSeconds() + i * 2);

    mockMessages.push({
      conversationId: conversation.id,
      senderId: sender.id,
      content: faker.lorem.sentence(),
      createdAt: createdAt,
    });
  }

  mockMessages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  await db.insert(messages).values(mockMessages);

  logger.info('Seeding complete!');
  await pool.end();
}

seed().catch((err) => {
  logger.error('Seeding failed:', err);
  pool.end();
  process.exit(1);
});
