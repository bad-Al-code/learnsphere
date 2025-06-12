import { eq } from "drizzle-orm";

import logger from "../config/logger";
import { db } from "../db";
import { users } from "../db/schema";
import { BadRequestError } from "../errors";
import { Password } from "../utils/password";
import crypto from "node:crypto";

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

    const verificationToken = crypto.randomBytes(40).toString("hex");
    const hashedVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    const passwordHash = await Password.toHash(password);

    const newUser = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        verificationToken: hashedVerificationToken,
      })
      .returning({ id: users.id, email: users.email });

    logger.info(`User created successfully with ID: ${newUser[0].id}`);

    return { user: newUser[0], verificationToken };
  }

  public static async login(email: string, password: string) {
    logger.debug(`Login attempt for email: ${email}`);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existingUser) {
      logger.warn(`Login failed: User not found for email ${email}`);

      throw new BadRequestError("Invalid credentials");
    }

    const passwordMatch = await Password.compare(
      existingUser.passwordHash,
      password
    );

    if (!passwordMatch) {
      logger.warn(`Login failed: Invalid password for ${email}`);

      throw new BadRequestError("Invalid credentials");
    }

    // const userJwt = jwt.sign(
    //   {
    //     id: existingUser.id,
    //     email: existingUser.email,
    //   },
    //   process.env.JWT_SECRET!,
    //   { expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
    // );

    // logger.info(
    //   `User logged in successfully: ${email} (ID: ${existingUser.id})`
    // );

    // return {
    //   id: existingUser.id,
    //   email: existingUser.email,
    //   token: userJwt,
    // };

    return existingUser;
  }
}
