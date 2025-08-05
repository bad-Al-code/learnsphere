import { eq } from 'drizzle-orm';
import { db } from '..';
import { Category, NewCategory, UpdateCatgory } from '../../types';
import { categories } from '../schema';

export class CategoryRepository {
  /**
   * Creates a new category.
   * @param data The data for the new category
   * @returns The newly created cateory object
   */
  public static async create(data: NewCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(data).returning();

    return newCategory;
  }

  /**
   * Finds all categories.
   * @returns An array of all category objects.
   */
  public static async findAll(): Promise<Category[]> {
    return db.query.categories.findMany();
  }

  /**
   * Finds a single category by its ID.
   * @param id - The ID of the category to find.
   * @returns A category object or undefined if not found.
   */
  public static async findById(id: string): Promise<Category | undefined> {
    return db.query.categories.findFirst({ where: eq(categories.id, id) });
  }

  /**
   * Updates a category's data.
   * @param id - The ID of the category to update.
   * @param data - An object with the fields to update.
   * @returns The updated category object.
   */
  public static async update(
    id: string,
    data: UpdateCatgory
  ): Promise<Category> {
    const [updatedCategory] = await db
      .update(categories)
      .set(data)
      .where(eq(categories.id, id))
      .returning();

    return updatedCategory;
  }

  /**
   * Deletes a category by its ID.
   * @param id - The ID of the category to delete.
   */
  public static async delete(id: string): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  /**
   * Finds a category by its slug.
   * @param slug - The unique slug of the category.
   * @returns The category object if found, otherwise undefined.
   */
  public static async findBySlug(slug: string): Promise<Category | undefined> {
    return db.query.categories.findFirst({ where: eq(categories.slug, slug) });
  }
}
