export type User = {
  userId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isVerified: boolean;
  headline: string | null;
  role: "student" | "instructor" | "admin";
  status: "active" | "pending_instructor_review" | "suspended";
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
