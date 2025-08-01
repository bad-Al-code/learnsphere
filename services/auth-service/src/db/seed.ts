import { faker } from '@faker-js/faker';
import { db } from '.';
import { rabbitMQConnection } from '../events/connection';
import { UserRegisteredPublisher } from '../events/publisher';
import { users } from './schema';

async function seedUsers(count = 500) {
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
        role: 'student',
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

    console.log(`${count} users seeded and events emitted.`);
  }
}
seedUsers().catch(console.error);
