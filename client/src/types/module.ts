import { Lesson } from './lesson';

export type Module = {
  id: string;
  title: string;
  order?: number;
  lessons: Lesson[];
};
