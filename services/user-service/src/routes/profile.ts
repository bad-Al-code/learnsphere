/**
 * @openapi
 * tags:
 *   - name: Profiles
 *     description: User profile management
 */

import { Router } from 'express';

import { requireAuth } from '../middlewares/require-auth';
import { requireRole } from '../middlewares/require-role';
import { validateRequest } from '../middlewares/validate-request';
import {
  avatarUploadUrlSchema,
  bulkUsersSchema,
  searchProfileSchema,
  updateProfileSchema,
} from '../schemas/profile-schema';
import { ProfileController } from '../controllers/profile.controller';

const router = Router();

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     summary: Get the profile of the currently authenticated user
 *     tags: [Profiles]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: The user's profile data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *       '401':
 *         description: Unauthorized.
 */
router.get('/me', requireAuth, ProfileController.getMyProfile);

/**
 * @openapi
 * /api/users/me:
 *   put:
 *     summary: Update the profile of the currently authenticated user
 *     tags: [Profiles]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfilePayload'
 *     responses:
 *       '200':
 *         description: The updated user profile.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *       '401':
 *         description: Unauthorized.
 *       '400':
 *         description: Invalid input data.
 */
router.put(
  '/me',
  requireAuth,
  validateRequest(updateProfileSchema),
  ProfileController.updateMyProfile
);

router.post(
  '/me/avatar-upload-url',
  requireAuth,
  validateRequest(avatarUploadUrlSchema),
  ProfileController.getAvatarUploadUrl
);

router.get(
  '/search',
  validateRequest(searchProfileSchema),
  ProfileController.searchProfiles
);
router.post(
  '/bulk',
  validateRequest(bulkUsersSchema),
  ProfileController.getBulkProfiles
);
router.get('/:id', ProfileController.getProfileById);

router.put(
  '/:id',
  requireAuth,
  requireRole(['admin']),
  validateRequest(updateProfileSchema),
  ProfileController.updateUserProfileById
);

export { router as profileRouter };
