export type Course = {
  id: string;
  title: string;
  description: string | null;
  instructor: {
    firstName: string | null;
    lastName: string | null;
    avatarUrls?: { small?: string };
  } | null;
};
