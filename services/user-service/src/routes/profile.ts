/**
 * @openapi
 * tags:
 *   - name: My Profile
 *     description: Actions related to the currently authenticated user's own profile.
 *   - name: Public Profiles
 *     description: Reading and searching for public user profiles.
 *   - name: Admin
 *     description: Administrative actions for managing user profiles.
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
 *     tags: [My Profile]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: The user's full, private profile data.
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
 *     tags: [My Profile]
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

/**
 * @openapi
 * /api/users/me/avatar-upload-url:
 *   post:
 *     summary: Get a presigned URL to upload a new avatar
 *     tags: [My Profile]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AvatarUploadUrlRequest'
 *     responses:
 *       '200':
 *         description: A presigned URL for the client to upload the avatar file to.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AvatarUploadUrlResponse'
 *       '401':
 *         description: Unauthorized.
 */
router.post(
  '/me/avatar-upload-url',
  requireAuth,
  validateRequest(avatarUploadUrlSchema),
  ProfileController.getAvatarUploadUrl
);

/**
 * @openapi
 * /api/users/search:
 *   get:
 *     summary: Search for user profiles
 *     tags: [Public Profiles]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: The search term to query against first and last names.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of results per page.
 *     responses:
 *       '200':
 *         description: A paginated list of user profiles.
 */
router.get(
  '/search',
  validateRequest(searchProfileSchema),
  ProfileController.searchProfiles
);

/**
 * @openapi
 * /api/users/bulk:
 *   post:
 *     summary: Get multiple public user profiles by their IDs
 *     tags: [Public Profiles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkUserRequest'
 *     responses:
 *       '200':
 *         description: An array of public user profiles.
 */
router.post(
  '/bulk',
  validateRequest(bulkUsersSchema),
  ProfileController.getBulkProfiles
);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get a single user profile by ID
 *     tags: [Public Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the user to retrieve.
 *     responses:
 *       '200':
 *         description: The public profile of the user.
 *       '404':
 *         description: User profile not found.
 */
router.get('/:id', ProfileController.getProfileById);

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: "[Admin] Update a user's profile by ID"
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the user profile to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfilePayload'
 *     responses:
 *       '200':
 *         description: The updated user profile.
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden. Requester is not an admin.
 */
router.put(
  '/:id',
  requireAuth,
  requireRole(['admin']),
  validateRequest(updateProfileSchema),
  ProfileController.updateUserProfileById
);

export { router as profileRouter };
