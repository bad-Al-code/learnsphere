import slugify from 'slugify';
import { CategoryRepository } from '../db/repostiories';
import { NotFoundError } from '../errors';
import { Category, UpdateCatgory } from '../types';

export class CategoryService {
  private static generateSlug(name: string): string {
    return slugify(name, { lower: true, strict: true });
  }

  public static async createCategory(data: {
    name: string;
  }): Promise<Category> {
    const slug = this.generateSlug(data.name);

    return CategoryRepository.create({ name: data.name, slug });
  }

  public static async getAllCategories(): Promise<Category[]> {
    return CategoryRepository.findAll();
  }

  public static async updateCategory(
    id: string,
    data: { name: string }
  ): Promise<Category> {
    const updatePayload: UpdateCatgory = { name: data.name };
    if (data.name) {
      updatePayload.slug = this.generateSlug(data.name);
    }

    const updatedCategory = await CategoryRepository.update(id, updatePayload);
    if (!updatePayload) {
      throw new NotFoundError('Category');
    }

    return updatedCategory;
  }

  public static async deleteCategory(id: string): Promise<void> {
    const category = await CategoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError('Category');
    }

    await CategoryRepository.delete(id);
  }

  public static async getCategoryBySlug(slug: string): Promise<Category> {
    const category = await CategoryRepository.findBySlug(slug);
    if (!category) {
      throw new NotFoundError('Category');
    }

    return category;
  }
}
