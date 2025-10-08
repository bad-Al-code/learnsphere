import { Router } from 'express';

import { MentorshipController } from '../controllers';
import { requireAuth, validateRequest } from '../middlewares';
import { becomeMentorSchema, getMentorshipProgramsSchema } from '../schemas';

const router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /api/community/mentorships:
 *   get:
 *     summary: Get a list of mentorship programs
 *     description: Retrieve mentorship programs filtered by search query, status, free programs, favorites, and pagination options.
 *     tags:
 *       - Mentorship
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search term to filter mentorship programs by title.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, all]
 *         description: Filter programs by their current status.
 *       - in: query
 *         name: isFree
 *         schema:
 *           type: boolean
 *         description: Filter for free mentorship programs only.
 *       - in: query
 *         name: isFavorite
 *         schema:
 *           type: boolean
 *         description: Show only programs the authenticated user has favorited.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Maximum number of programs to return.
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: Pagination cursor for fetching the next set of results.
 *     responses:
 *       200:
 *         description: A list of mentorship programs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 programs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       mentorName:
 *                         type: string
 *                       price:
 *                         type: string
 *                       status:
 *                         type: string
 *                 nextCursor:
 *                   type: string
 *                   nullable: true
 *                 total:
 *                   type: integer
 *       400:
 *         description: Invalid request or validation error.
 *       401:
 *         description: Unauthorized — authentication required.
 *       404:
 *         description: Resource not found.
 */
router.get(
  '/',
  validateRequest(getMentorshipProgramsSchema),
  MentorshipController.getPrograms
);

/**
 * @openapi
 * /api/community/mentorships/apply:
 *   post:
 *     summary: Apply to become a mentor
 *     description: Allows an authenticated user to submit an application to become a mentor in the community.
 *     tags:
 *       - Mentorship
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BecomeMentorDto'
 *     responses:
 *       201:
 *         description: Mentor application submitted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MentorshipApplication'
 *       400:
 *         description: Invalid request body or missing required fields.
 *       401:
 *         description: Unauthorized — user must be authenticated.
 *       409:
 *         description: User already has a pending or approved mentorship application.
 *       500:
 *         description: Internal server error.
 *     x-requireAuth: true
 */
router.post(
  '/apply',
  validateRequest(becomeMentorSchema),
  MentorshipController.applyToBeMentor
);

/**
 * @openapi
 * /api/community/mentorships/status:
 *   get:
 *     summary: Get current user's mentorship application status
 *     description: Returns the mentorship application status of the currently authenticated user.
 *     tags:
 *       - Mentorships
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's mentorship application status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [pending, approved, rejected]
 *                   example: pending
 *                 expertise:
 *                   type: string
 *                   example: Web Development
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-10-08T14:23:00.000Z
 *       401:
 *         description: Unauthorized — user must be authenticated.
 *       404:
 *         description: No mentorship application found for this user.
 *       500:
 *         description: Internal server error.
 *     x-requireAuth: true
 */
router.get('/status', MentorshipController.getMentorshipStatus);

export { router as mentorshipRouter };
