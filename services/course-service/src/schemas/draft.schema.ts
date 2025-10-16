import { z } from 'zod';

import { draftPriorityEnum, draftStatusEnum } from '../db/schema';

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateDraft:
 *       type: object
 *       required:
 *         - assignmentId
 *         - title
 *       properties:
 *         assignmentId:
 *           type: string
 *           format: uuid
 *           description: ID of the assignment
 *         title:
 *           type: string
 *           description: Draft title
 *         content:
 *           type: string
 *           description: Draft content
 *         status:
 *           type: string
 *           enum: [draft, reviewing, completed]
 *           description: Status of the draft
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           description: Priority of the draft
 *         category:
 *           type: string
 *           maxLength: 100
 *           description: Category of the draft
 *         wordCount:
 *           type: integer
 *           minimum: 0
 *           description: Word count of the draft
 */
export const createDraftSchema = z.object({
  body: z.object({
    assignmentId: z.string().uuid(),
    title: z.string().min(1, 'Title cannot be empty'),
    content: z.string().optional(),
    status: z.enum(draftStatusEnum.enumValues).optional(),
    priority: z.enum(draftPriorityEnum.enumValues).optional(),
    category: z.string().max(100).optional(),
    wordCount: z.number().int().nonnegative().optional(),
  }),

  params: z.object({}).optional(),

  query: z.object({}).optional(),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateDraft:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Draft title
 *         content:
 *           type: string
 *           description: Draft content
 *         status:
 *           type: string
 *           enum: [draft, reviewing, completed]
 *           description: Status of the draft
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           description: Priority of the draft
 *         category:
 *           type: string
 *           maxLength: 100
 *           description: Category of the draft
 *         wordCount:
 *           type: integer
 *           minimum: 0
 *           description: Word count of the draft
 */

export const updateDraftSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    content: z.string().optional(),
    status: z.enum(draftStatusEnum.enumValues).optional(),
    priority: z.enum(draftPriorityEnum.enumValues).optional(),
    category: z.string().max(100).optional(),
    wordCount: z.number().int().nonnegative().optional(),
  }),

  params: z.object({
    id: z.string().uuid(),
  }),

  query: z.object({}).optional(),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     DraftIdParam:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID of the draft
 */

export const draftIdParamSchema = z.object({
  body: z.object({}).optional(),

  params: z.object({
    id: z.string().uuid(),
  }),

  query: z.object({}).optional(),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     AddCollaboratorBody:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the collaborator to add.
 *
 *     AddCollaboratorParams:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The ID of the resource to which the collaborator will be added.
 */

/**
 * @openapi
 * /collaborators/{id}:
 *   post:
 *     summary: Add a collaborator to a resource
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/AddCollaboratorParams'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddCollaboratorBody'
 *     responses:
 *       200:
 *         description: Collaborator added successfully
 *       400:
 *         description: Invalid email or ID
 */

export const addCollaboratorSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email('Please provide a valid email for the collaborator.'),
  }),
  params: z.object({ id: z.string().uuid() }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     ShareTokenParams:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: string
 *           description: The JWT token for accessing the shared draft
 */
export const shareTokenParamsSchema = z.object({
  params: z.object({ token: z.string() }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     LogTimeSchema:
 *       type: object
 *       required:
 *         - body
 *       properties:
 *         body:
 *           type: object
 *           required:
 *             - minutes
 *           properties:
 *             minutes:
 *               type: integer
 *               minimum: 1
 *               description: Number of minutes logged. Must be a positive integer.
 */
export const logTimeSchema = z.object({
  body: z.object({
    minutes: z.number().int().positive('Minutes must be a positive integer.'),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     TimeSummaryQuerySchema:
 *       type: object
 *       required:
 *         - query
 *       properties:
 *         query:
 *           type: object
 *           required:
 *             - studentId
 *             - courseIds
 *           properties:
 *             studentId:
 *               type: string
 *               format: uuid
 *               description: Unique identifier of the student.
 *             courseIds:
 *               type: array
 *               items:
 *                 type: string
 *                 format: uuid
 *               description: List of course IDs (comma-separated string or array).
 */
export const timeSummaryQuerySchema = z.object({
  query: z.object({
    studentId: z.string().uuid(),
    courseIds: z.preprocess(
      (val) => (typeof val === 'string' ? val.split(',') : val),
      z.array(z.string().uuid())
    ),
  }),
});

export const logTimeParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});
