import { faker } from '@faker-js/faker';
import { db } from '..';
import { rabbitMQConnection } from '../../events/connection';
import { UserRegisteredPublisher } from '../../events/publisher';
import { users } from '../schema';

type ROLE = 'admin' | 'student' | 'instructor';

function getRandomRole(): ROLE {
  return faker.helpers.arrayElement(['student']);
}

async function seedUsers(count = 50) {
  await rabbitMQConnection.connect();

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });
    const passwordHash = faker.internet.password();
    const avatarUrl = faker.image.avatar();

    const [user] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        role: getRandomRole(),
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    const registeredPublisher = new UserRegisteredPublisher();
    await registeredPublisher.publish({
      id: user.id!,
      email: user.email,
      firstName,
      lastName,
      avatarUrl,
    });

    console.log(`User ${i + 1} created: ${user.email}`);
    console.log(`UserID: ${user.id}`);
  }

  await rabbitMQConnection.close();

  console.log('All users seeded and events emitted.');
  process.exit(0);
}

seedUsers().catch((err) => {
  console.error('Error seeding users:', err);
  process.exit(1);
});
