import bcrypt from "bcrypt";

export class Password {
  static async toHash(password: string): Promise<string> {
    const saltRounds = 10;

    return bcrypt.hash(password, saltRounds);
  }

  static async compare(
    storedPasswordHash: string,
    suppliedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(suppliedPassword, storedPasswordHash);
  }
}
