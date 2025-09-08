import { eq } from 'drizzle-orm';
import { UserClient } from '../clients/user.client';
import { db } from '../db';
import { UserRepository } from '../db/repositories';
import { User, users } from '../db/schema';

export class UserService {
  /**
   * Finds a user in the local database. If not found, fetches from the
   * user-service, saves it locally, and then returns it.
   * @param userId The ID of the user to find or fetch.
   * @returns The user record from the local database.
   * @throws An error if the user cannot be found in either source.
   */
  public static async findOrFetchUser(userId: string): Promise<User> {
    const localUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    if (localUser) {
      return localUser;
    }

    const remoteUser = await UserClient.getUserById(userId);
    if (!remoteUser) {
      throw new Error(`User with ID ${userId} could not be found.`);
    }

    await UserRepository.upsert({
      id: remoteUser.id,
      name: remoteUser.name,
      avatarUrl: remoteUser.avatarUrl,
    });

    return (await db.query.users.findFirst({
      where: eq(users.id, userId),
    }))!;
  }
}
