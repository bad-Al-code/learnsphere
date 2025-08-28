export type Lesson = {
  id: string;
  title: string;
  isPublished: boolean;
  lessonType: 'video' | 'text' | 'quiz';
  duration: string;
  order: number;
};
