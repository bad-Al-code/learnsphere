export type Course = {
  id: string;
  title: string;
  description: string | null;
  level: string;
  imageUrl: string | null;
  price: number | null;
  currency: string | undefined;
  instructor: {
    firstName: string | null;
    lastName: string | null;
    avatarUrls?: { small?: string };
  } | null;
};

export const COURSE_LEVELS = [
  { value: "all", label: "All Levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];
