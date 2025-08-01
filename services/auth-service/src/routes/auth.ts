/**
 * @openapi
 * tags:
 *   - name: Authentication
 *     description: User authentication, registration, and session management.
 *
 *   - name: Account Management
 *     description: Email verification and password management.
 */

import { Router } from 'express';

import { AuthController } from '../controllers/auth.controller';
import { apiLimiter } from '../middlewares/rate-limiter';
import { requireAuth } from '../middlewares/require-auth';
import { requireRole } from '../middlewares/require-role';
import { validateRequest } from '../middlewares/validate-request';
import {
  forgotPasswordSchema,
  loginSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  signupSchema,
  updatePasswordSchema,
  verifyEmailSchema,
  verifyResetCodeSchema,
  verifyResetTokenSchema,
} from '../schemas/auth-schema';

const router = Router();

/**
 * @openapi
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSignup'
 *     responses:
 *       '201':
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       '400':
 *         description: Invalid input or email already in use.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/signup', validateRequest(signupSchema), AuthController.signup);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       '200':
 *         description: User logged in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       '400':
 *         description: Invalid credentials.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/login',
  apiLimiter,
  validateRequest(loginSchema),
  AuthController.login
);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Log out the current user
 *     tags: [Authentication]
 *     description: Clears the authentication cookies. This endpoint requires a valid session to be active.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Logout successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericSuccess'
 */
router.post('/logout', AuthController.logout);

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh the access token
 *     tags: [Authentication]
 *     description: Uses the `refreshToken` cookie to issue a new `token` (access token).
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Access token refreshed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       '401':
 *         description: No refresh token provided or token is invalid/expired.
 */
router.post('/refresh', AuthController.refresh);

/**
 * @openapi
 * /api/auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     tags: [Authentication]
 *     description: Redirects the user to Google's consent screen to start the login process.
 *     responses:
 *       '302':
 *         description: Redirect to Google's authentication page.
 */
router.get('/google', AuthController.googleLogin);

/**
 * @openapi
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback URL
 *     tags: [Authentication]
 *     description: The URL Google redirects to after user authentication. It handles user creation/login and sets session cookies. Should not be called directly by clients.
 *     responses:
 *       '200':
 *         description: Authentication successful. Cookies are set.
 *       '401':
 *         description: Authentication failed.
 */
router.get('/google/callback', AuthController.googleCallback);

/**
 * @openapi
 * /api/auth/verify-email:
 *   post:
 *     summary: Verify a user's email address
 *     tags: [Account Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyEmail'
 *     responses:
 *       '200':
 *         description: Email verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericSuccess'
 *       '401':
 *         description: Token is invalid or expired.
 */
router.post(
  '/verify-email',
  validateRequest(verifyEmailSchema),
  AuthController.verifyEmail
);

/**
 * @openapi
 * /api/auth/resend-verification:
 *   post:
 *     summary: Resend the verification email
 *     tags: [Account Management]
 *     description: Sends a new verification link to a user's email if their account is not yet verified. For security, it always returns a generic success message.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailPayload'
 *     responses:
 *       '200':
 *         description: A generic success message.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericSuccess'
 */
router.post(
  '/resend-verification',
  apiLimiter,
  validateRequest(resendVerificationSchema),
  AuthController.resendVerificationEmail
);

/**
 * @openapi
 * /api/auth/forgot-password:
 *   post:
 *     summary: Initiate the password reset process
 *     tags: [Account Management]
 *     description: Sends a password reset link to the user's email. For security, it always returns a generic success message.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailPayload'
 *     responses:
 *       '200':
 *         description: A generic success message.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericSuccess'
 */
router.post(
  '/forgot-password',
  apiLimiter,
  validateRequest(forgotPasswordSchema),
  AuthController.forgotPassword
);

router.post(
  '/verify-reset-code',
  validateRequest(verifyResetCodeSchema),
  AuthController.verifyResetCode
);

router.post(
  '/verify-reset-token',
  validateRequest(verifyResetTokenSchema),
  AuthController.verifyResetToken
);

/**
 * @openapi
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset a user's password using a token
 *     tags: [Account Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPassword'
 *     responses:
 *       '200':
 *         description: Password has been reset successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericSuccess'
 *       '401':
 *         description: Token is invalid or expired.
 */
router.post(
  '/reset-password',
  validateRequest(resetPasswordSchema),
  AuthController.resetPassword
);

/**
 * @openapi
 * /api/auth/update-password:
 *   patch:
 *     summary: Update the current user's password
 *     tags: [Account Management]
 *     description: Allows a logged-in user to change their own password.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePassword'
 *     responses:
 *       '200':
 *         description: Password updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericSuccess'
 *       '401':
 *         description: Authentication required or current password is incorrect.
 *       '400':
 *         description: Invalid input for new password.
 */
router.patch(
  '/update-password',
  requireAuth,
  validateRequest(updatePasswordSchema),
  AuthController.updatePassword
);

/**
 * @openapi
 * /api/auth/sessions:
 *   get:
 *     summary: Get all active sessions for the current user
 *     tags: [Account Management]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: A list of active sessions.
 *       '401':
 *         description: Unauthorized.
 */
router.get('/sessions', requireAuth, AuthController.getSessions);

/**
 * @openapi
 * /api/auth/sessions/all-except-current:
 *   delete:
 *     summary: Terminate all other sessions for the current user
 *     tags: [Account Management]
 *     description: Logs the current user out of all devices except the one making this request.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: All other sessions terminated successfully.
 *       '401':
 *         description: Unauthorized.
 */
router.delete(
  '/sessions/all-except-current',
  requireAuth,
  AuthController.terminateAllOtherSessions
);

/**
 * @openapi
 * /api/auth/sessions/{sessionId}:
 *   delete:
 *     summary: Terminate a specific user session
 *     tags: [Account Management]
 *     description: Logs out a specific device/session by its ID.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The JTI of the session to terminate.
 *     responses:
 *       '200':
 *         description: Session terminated successfully.
 *       '401':
 *         description: Unauthorized.
 */
router.delete(
  '/sessions/:sessionId',
  requireAuth,
  AuthController.terminateSession
);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get user details by ID
 *     tags: [Authentication]
 *     description: Returns basic details of a user. Requires admin access.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to fetch.
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: User details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 email:
 *                   type: string
 *                   format: email
 *                 role:
 *                   type: string
 *                 isVerified:
 *                   type: boolean
 *       '401':
 *         description: Unauthorized. Missing or invalid session token.
 *       '403':
 *         description: Forbidden. Admin role required.
 *       '404':
 *         description: User not found.
 */

router.get(
  '/users/:id',
  requireAuth,
  requireRole(['admin']),
  AuthController.getUserDetailsById
);

/**
 * @openapi
 * /api/auth/test-auth:
 *   get:
 *     summary: Test authentication and role middleware
 *     tags: [Authentication]
 *     description: An example of a protected route that requires a valid session cookie and 'admin' role.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Access granted. Returns user and token info.
 *       '401':
 *         description: Unauthorized. Missing or invalid token.
 *       '403':
 *         description: Forbidden. User does not have the required role.
 */
router.get(
  '/test-auth',
  requireAuth,
  requireRole(['admin']),
  AuthController.testAuth
);

export { router as authRouter };
