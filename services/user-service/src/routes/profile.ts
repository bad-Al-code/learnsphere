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
  fcmTokenSchema,
  searchProfileSchema,
  updateProfileSchema,
  updateSettingsSchema,
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
 * /api/users/me/settings:
 *   get:
 *     summary: Get the current user's application settings
 *     tags: [My Profile]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: The user's settings object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSettings'
 *       '401':
 *         description: Unauthorized.
 */
router.get('/me/settings', requireAuth, ProfileController.getMySettings);

/**
 * @openapi
 * /api/users/me/settings:
 *   put:
 *     summary: Update the current user's application settings
 *     tags: [My Profile]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSettings'
 *     responses:
 *       '200':
 *         description: The updated settings object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSettings'
 *       '401':
 *         description: Unauthorized.
 */
router.put(
  '/me/settings',
  requireAuth,
  validateRequest(updateSettingsSchema),
  ProfileController.updateMySettings
);

/**
 * @openapi
 * /api/users/me/apply-for-instructor:
 *   post:
 *     summary: Submit an application to become an instructor
 *     tags: [My Profile]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Application submitted successfully.
 *       '401':
 *         description: Unauthorized.
 *       '400':
 *         description: User already has a pending application or is already an instructor.
 */
router.post(
  '/me/apply-for-instructor',
  requireAuth,
  ProfileController.applyForInstructor
);

router.post(
  '/me/fcm-tokens',
  requireAuth,
  validateRequest(fcmTokenSchema),
  ProfileController.addFcmToken
);

router.delete(
  '/me/fcm-tokens',
  requireAuth,
  validateRequest(fcmTokenSchema),
  ProfileController.removeFcmToken
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

/**
 * @openapi
 * /api/users/{id}/approve-instructor:
 *   post:
 *     summary: "[Admin] Approve a user's instructor application"
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
 *         description: The ID of the user whose application is being approved.
 *     responses:
 *       '200':
 *         description: The user's profile, now with an updated role.
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden. Requester is not an admin.
 *       '400':
 *         description: User did not have a pending application.
 */
router.post(
  '/:id/approve-instructor',
  requireAuth,
  requireRole(['admin']),
  ProfileController.approveInstructor
);

/**
 * @openapi
 * /api/users/{id}/suspend:
 *   post:
 *     summary: "[Admin] Suspend a user's account"
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
 *         description: The ID of the user to suspend.
 *     responses:
 *       '200':
 *         description: User suspended successfully.
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden. Requester is not an admin.
 */
router.post(
  '/:id/suspend',
  requireAuth,
  requireRole(['admin']),
  ProfileController.suspendUser
);

export { router as profileRouter };
