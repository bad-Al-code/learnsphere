import { userRoleEnum, users } from '../db/schema';

export type UserRecord = typeof users.$inferSelect;

export interface TokenPayload {
  id: string;
  email: string;
  role: (typeof userRoleEnum.enumValues)[number];
  jti: string;
  iat: number;
  exp: number;
}

export interface UserPayload {
  id: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
}

export interface CurrentUser {
  tokenPayload: TokenPayload;
  dbUser: UserRecord;
}

export interface AttachCookiesOptions {
  accessToken: boolean;
  refreshToken: boolean;
}
