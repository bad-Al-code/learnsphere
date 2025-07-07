import { eq } from "drizzle-orm";

import logger from "../config/logger";
import { db } from "../db";
import { users } from "../db/schema";
import { BadRequestError, UnauthenticatedError } from "../errors";
import { Password } from "../utils/password";
import { TokenUtil } from "../utils/crypto";
import { AuthService } from "../services/auth.service";

const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;
const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;

export class AuthController {
  public static async singup(email: string, password: string) {
    const result = await AuthService.singup(email, password);

    return result;
  }

  public static async login(email: string, password: string) {
    const user = await AuthService.login(email, password);

    return user;
  }

  public static async verifyEmail(email: string, verificationToken: string) {
    await AuthService.verifyEmail(email, verificationToken);
  }

  public static async forgotPassword(email: string) {
    const result = await AuthService.forgotPassword(email);

    return result;
  }

  public static async resetPassword(
    email: string,
    token: string,
    password: string
  ) {
    await AuthService.resetPassword(email, token, password);
  }

  public static async resendVerificationEmail(email: string) {
    const result = await AuthService.resendVerificationEmail(email);

    return result;
  }
}
