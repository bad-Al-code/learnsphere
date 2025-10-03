import { Router } from 'express';

import { MentorshipController } from '../controllers';
import { requireAuth, validateRequest } from '../middlewares';
import { getMentorshipProgramsSchema } from '../schemas';

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

export { router as mentorshipRouter };
