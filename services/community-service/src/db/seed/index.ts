import { faker } from '@faker-js/faker';
import { db, pool } from '..';
import logger from '../../config/logger';
import {
  conversationParticipants,
  conversations,
  messages,
  users,
} from '../schema';

const profileUsers = [
  {
    id: '5bdb6c2f-10bc-439d-9740-aadacb7bae46',
    name: 'Francis Goodwin',
  },
  {
    id: 'b06531a1-2563-4702-8706-819ce72649ac',
    name: 'Kelvin Thompson',
  },
  {
    id: 'c5020261-df8e-4043-9569-958ab630f493',
    name: 'Admin Funk',
  },
  {
    id: '410e8e92-6056-484a-beb6-803218bd3574',
    name: 'Broderick Goyette',
  },
  {
    id: 'e12aefe0-858c-47b1-8a26-3c5fd95f6bbd',
    name: 'Francesca Simonis',
  },
  {
    id: 'b6a767f5-d082-4ee3-b019-5d2a79adeb2b',
    name: 'Maximillia Rutherford',
  },
  {
    id: '83e335fe-86b3-4067-8f35-938cf2d29797',
    name: 'Lavonne Little',
  },
  {
    id: '7c9b385c-4d43-448d-90e9-dd67ae7a65e3',
    name: "London D'Amore",
  },
  {
    id: '64d31b63-a2a9-4435-89a0-b2f39770bf40',
    name: 'Jamir Heathcote',
  },
  {
    id: '4cf07d2a-77d8-4ce1-90c0-47312c3fa98c',
    name: 'Luella Runolfsdottir',
  },
];

async function seed() {
  await db
    .insert(users)
    .values(
      profileUsers.map((u) => ({
        id: u.id,
        name: u.name,
        avatarUrl: faker.image.avatar(),
      }))
    )
    .onConflictDoNothing();

  const convs = await db
    .insert(conversations)
    .values(
      Array.from({ length: 20 }).map(() => ({
        type: faker.helpers.arrayElement(['direct', 'group']),
        name: faker.lorem.words({ min: 5, max: 10 }),
      }))
    )
    .returning();

  for (const conv of convs) {
    const participantCount =
      conv.type === 'direct' ? 10 : faker.number.int({ min: 3, max: 6 });

    const pickedUsers = faker.helpers.arrayElements(
      profileUsers.map((u) => u.id),
      participantCount
    );

    await db.insert(conversationParticipants).values(
      pickedUsers.map((userId) => ({
        conversationId: conv.id,
        userId,
      }))
    );

    const messageCount = faker.number.int({ min: 20, max: 30 });
    await db.insert(messages).values(
      Array.from({ length: messageCount }).map(() => ({
        conversationId: conv.id,
        senderId: faker.helpers.arrayElement(pickedUsers),
        content: faker.lorem.sentence(),
      }))
    );
  }

  logger.info('Done seeding!');
  await pool.end();
}

seed().catch((err) => {
  console.error(err);
  pool.end();
});
