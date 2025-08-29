import { modules } from '../db/schema';

export type Module = typeof modules.$inferSelect;
export type NewModule = typeof modules.$inferInsert;

export interface CreateModuleDto {
  title: string;
  courseId: string;
}

export interface UpdateModuleDto {
  title?: string;
  order?: number;
  isPublished?: boolean;
}
