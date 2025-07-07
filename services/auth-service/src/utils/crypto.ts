import crypto from "node:crypto";
export class TokenUtil {
  public static hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  public static generateHashedToken(): {
    rawToken: string;
    hashedToken: string;
  } {
    const rawToken = crypto.randomBytes(40).toString("hex");
    const hashedToken = this.hashToken(rawToken);
    return { rawToken, hashedToken };
  }

  public static getExpirationDate(durationInMs: number): Date {
    return new Date(Date.now() + durationInMs);
  }
}
