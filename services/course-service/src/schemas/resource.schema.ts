import { z } from 'zod';
import { resources } from '../db/schema';

export type Resource = typeof resources.$inferSelect;
export type NewResource = typeof resources.$inferInsert;

/**
 * @openapi
 * components:
 *   schemas:
 *     Resource:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         fileUrl:
 *           type: string
 *           format: uri
 *         fileName:
 *           type: string
 *         fileSize:
 *           type: number
 *         fileType:
 *           type: string
 *
 *     CreateResourcePayload:
 *       type: object
 *       required: [title, fileUrl, fileName, fileSize, fileType]
 *       properties:
 *         title:
 *           type: string
 *           example: "Course Syllabus PDF"
 *         fileUrl:
 *           type: string
 *           format: uri
 *           example: "https://s3.amazonaws.com/..."
 *         fileName:
 *           type: string
 *           example: "syllabus.pdf"
 *         fileSize:
 *           type: integer
 *           example: 1024768
 *         fileType:
 *           type: string
 *           example: "application/pdf"
 *
 *     UpdateResourcePayload:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 */
export const createResourceSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  fileUrl: z.string().url(),
  fileName: z.string().min(1),
  fileSize: z.number().int().positive(),
  fileType: z.string().min(1),
});

export const updateResourceSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
});

export type CreateResourceDto = z.infer<typeof createResourceSchema>;
export type UpdateResourceDto = z.infer<typeof updateResourceSchema>;
