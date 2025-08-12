export type Lesson = {
  id: string;
  title: string;
  lessonType?: 'video' | 'text' | 'quiz';
  order: number;
  isPublished?: boolean;
};
