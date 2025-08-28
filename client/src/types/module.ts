import { Lesson } from './lesson';

export type Module = {
  id: string;
  title: string;
  isPublished: boolean;
  lessonCount: number;
  totalDuration: string;
  lessons: Lesson[];
  order: number;
};
