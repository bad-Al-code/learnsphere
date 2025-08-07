export type Module = {
  id: string;
  title: string;
  order?: number;
  lessons: {
    id: string;
    title: string;
    lessonType?: "video" | "text" | "quiz";
  }[];
};
