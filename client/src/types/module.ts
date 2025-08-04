export type Module = {
  id: string;
  title: string;
  lessons: {
    id: string;
    title: string;
    lessonType: "video" | "text" | "quiz";
  }[];
};
