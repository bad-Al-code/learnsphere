import { eq } from "drizzle-orm";

import { db } from "../db";
import { User } from "../db/database.types";
import { users } from "../db/schema";

export class AuthService {
  private static async _findUserByEmail(
    email: string
  ): Promise<User | undefined> {
    return db.query.users.findFirst({ where: eq(users.email, email) });
  }
}
