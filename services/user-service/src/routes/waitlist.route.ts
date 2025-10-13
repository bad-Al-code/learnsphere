import { Router } from 'express';

import { WaitlistController } from '../controllers/waitlist.controller';
import { validateRequest } from '../middlewares/validate-request';
import {
  checkEmailSchema,
  updateInterestsSchema,
  waitlistSchema,
} from '../schemas/waitlist.schema';

const router = Router();

/**
 * @openapi
 * /api/users/waitlist:
 *   post:
 *     summary: Add a user to the waitlist
 *     tags:
 *       - Waitlist
 *     description: Submits a user's email address to be notified upon product launch. Can optionally include a referral code.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JoinWaitlistPayload'
 *     responses:
 *       '201':
 *         description: Successfully added to the waitlist.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JoinWaitlistResponse'
 *       '400':
 *         description: Bad Request - The provided email is invalid or other validation failed.
 *       '409':
 *         description: Conflict - The email address is already on the waitlist.
 *       '500':
 *         description: Internal Server Error.
 */

router.post('/', validateRequest(waitlistSchema), WaitlistController.join);

/**
 * @openapi
 * /api/users/waitlist/check:
 *   get:
 *     summary: Check if an email exists in the waitlist
 *     tags:
 *       - Waitlist
 *     description: Checks whether a given email address is already registered in the waitlist.
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: The email address to check
 *         example: 'user@example.com'
 *     responses:
 *       '200':
 *         description: Successfully checked email existence.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CheckEmailResponse'
 *       '400':
 *         description: Bad Request - Invalid email format.
 *       '500':
 *         description: Internal Server Error.
 */
router.get(
  '/check',
  validateRequest(checkEmailSchema),
  WaitlistController.checkEmail
);

/**
 * @openapi
 * /api/users/waitlist/stats:
 *   get:
 *     summary: Get waitlist statistics
 *     tags:
 *       - Waitlist
 *     description: Retrieves statistics about the waitlist (total count).
 *     responses:
 *       '200':
 *         description: Successfully retrieved statistics.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WaitlistStatsResponse'
 *       '500':
 *         description: Internal Server Error.
 */
router.get('/stats', WaitlistController.getStats);

/**
 * @openapi
 * /api/users/waitlist/interests:
 *   put:
 *     summary: Update a user's interests on the waitlist
 *     tags:
 *       - Waitlist
 *     description: Sets or replaces the list of interest tags for a user on the waitlist, identified by their email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateInterestsPayload'
 *     responses:
 *       '200':
 *         description: Interests updated successfully.
 *       '400':
 *         description: Bad Request - The request body is invalid (e.g., bad email format, invalid interests array).
 *       '404':
 *         description: Not Found - The email address is not on the waitlist.
 *       '500':
 *         description: Internal Server Error.
 */
router.put(
  '/interests',
  validateRequest(updateInterestsSchema),
  WaitlistController.updateInterests
);

export { router as waitlistRouter };
