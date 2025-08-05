import { categories } from '../db/schema';

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type UpdateCatgory = Partial<Omit<NewCategory, 'id'>>;
