export type User = {
  userId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isVerified: boolean;
  headline: string | null;
  avatarUrls: {
    small?: string;
    medium?: string;
    large?: string;
  } | null;
  settings?: {
    language?: string;
  };
} | null;

export type Session = {
  jti: string;
  userId: string;
  ipAddress: string | null;
  userAgent: string | null;
  country: string | null;
  countryCode: string | null;
  createdAt: string;
};
