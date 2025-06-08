import { eq } from "drizzle-orm";
import logger from "../config/logger";
import { db } from "../db";
import { users } from "../db/schema";
import { BadRequestError } from "../errors";
import { Password } from "../utils/password";

interface UserData {
  email: string;
  passwordHash: string;
}

export class UserService {
  public static async singup(email: string, password: string) {
    logger.debug(`Checking if user exists with email: ${email}`);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      logger.warn(`Signup attempt with existing email: ${email}`);

      throw new BadRequestError("Email is already in use.");
    }

    const passwordHash = await Password.toHash(password);

    const newUser = await db
      .insert(users)
      .values({ email, passwordHash })
      .returning({ id: users.id, email: users.email });

    logger.info(`User created successfully with ID: ${newUser[0].id}`);

    return newUser[0];
  }
}
