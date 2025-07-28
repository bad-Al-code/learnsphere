import { z } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     UserSignup:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address.
 *           example: 'test.user@example.com'
 *         password:
 *           type: string
 *           format: password
 *           description: The user's password (min 8 characters).
 *           minLength: 8
 *           example: 'password123'
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: 'test.user@example.com'
 *         password:
 *           type: string
 *           format: password
 *           example: 'password123'
 *     VerifyEmail:
 *       type: object
 *       required:
 *         - email
 *         - token
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: 'test.user@example.com'
 *         code:
 *           type: string
 *           description: The verification code sent to the user's email.
 *           example: '234234'
 *         token:
 *           type: string
 *           description: The verification token sent to the user's email.
 *           example: 'asdad....'
 *     EmailPayload:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address.
 *           example: 'test.user@example.com'
 *     ResetPassword:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: 'test.user@example.com'
 *         code:
 *           type: string
 *           description: The password reset code sent to the user's email.
 *           example: '234234'
 *         token:
 *           type: string
 *           description: The verification token sent to the user's email.
 *           example: 'asdad....'
 *         password:
 *           type: string
 *           format: password
 *           description: The user's new password (min 8 characters).
 *           minLength: 8
 *           example: 'newSecurePassword456'
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The user's unique identifier.
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address.
 *         role:
 *           type: string
 *           enum: [student, instructor, admin]
 *           description: The user's role.
 *     GenericSuccess:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: A success or informational message.
 *           example: 'User logged out successfully'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: A description of the error.
 *               field:
 *                 type: string
 *                 description: The field that caused the error (optional).
 *     UpdatePassword:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           format: password
 *           example: 'myOldPassword123'
 *         newPassword:
 *           type: string
 *           format: password
 *           description: The user's new password (min 8 characters).
 *           example: 'myNewSecurePassword456'
 */

export const signupSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Not a valid email'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long')
      .max(50, 'Password must be at most 50 characters long'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Not a valid email'),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

export const verifyEmailSchema = z.object({
  body: z
    .object({
      email: z
        .string({ required_error: 'Email is required' })
        .email('Not a valid email'),
      code: z
        .string({ required_error: 'Verification code is required' })
        .length(6, 'Code must be 6 digits.')
        .optional(),
      token: z.string().min(32).optional(),
    })
    .refine((data) => data.code || data.token, {
      message: 'Either a code or a token must be provided.',
    }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email(),
  }),
});

export const resendVerificationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email(),
  }),
});

export const verifyResetCodeSchema = z.object({
  body: z.object({
    email: z.string().email('Not a valid email'),
    code: z.string().length(6, 'Code must be 6 digits.'),
  }),
});

export const verifyResetTokenSchema = z.object({
  body: z.object({
    email: z.string().email('Not a valid email'),
    token: z.string().min(32, 'Invalid token format.'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string({ required_error: 'Reset token is required' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must at least 8 characters long')
      .max(50, 'Password must be at most 50 characters long'),
  }),
});

export const updatePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string({
      required_error: 'Current password is required',
    }),
    newPassword: z
      .string({ required_error: 'New Password is required' })
      .min(8, 'New password must be at least 8 chracters long')
      .max(50, 'New password must be at most 50 characters long'),
  }),
});
