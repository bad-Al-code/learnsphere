import { eq } from "drizzle-orm";

import { db } from "../db";
import { User } from "../db/database.types";
import { users } from "../db/schema";
import logger from "../config/logger";
import { BadRequestError } from "../errors";
import { TokenUtil } from "../utils/crypto";
import { Password } from "../utils/password";

const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;
const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;

export class AuthService {
  private static async _findUserByEmail(
    email: string
  ): Promise<User | undefined> {
    return db.query.users.findFirst({ where: eq(users.email, email) });
  }

  public static async singup(email: string, password: string) {
    logger.debug(`Checking if user exists with email: ${email}`);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      logger.warn(`Signup attempt with existing email: ${email}`);

      throw new BadRequestError("Email is already in use.");
    }

    const { rawToken: verificationToken, hashedToken } =
      TokenUtil.generateHashedToken();
    const verificationTokenExpiresAt =
      TokenUtil.getExpirationDate(TWO_HOURS_IN_MS);

    const passwordHash = await Password.toHash(password);

    const newUser = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        verificationToken: hashedToken,
        verificationTokenExpiresAt,
      })
      .returning({ id: users.id, email: users.email, role: users.role });

    logger.info(`User created successfully with ID: ${newUser[0].id}`);

    return { user: newUser[0], verificationToken };
  }
}
