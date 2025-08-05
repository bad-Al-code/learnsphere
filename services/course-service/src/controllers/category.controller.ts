import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CategoryService } from '../services';

export class CategoryController {
  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoryService.createCategory(req.body);

      res.status(StatusCodes.CREATED).json(category);
    } catch (error) {
      next(error);
    }
  }

  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await CategoryService.getAllCategories();

      res.status(StatusCodes.OK).json(categories);
    } catch (error) {
      next(error);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoryService.updateCategory(
        req.params.id,
        req.body
      );

      res.status(StatusCodes.OK).json(category);
    } catch (error) {
      next(error);
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await CategoryService.deleteCategory(req.params.id);

      res
        .status(StatusCodes.OK)
        .json({ message: 'Category deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  public static async getBySlug(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const category = await CategoryService.getCategoryBySlug(req.params.slug);
      res.status(StatusCodes.OK).json(category);
    } catch (error) {
      next(error);
    }
  }
}
