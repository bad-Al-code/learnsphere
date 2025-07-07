import { Router } from 'express';

import { validateRequest } from '../middlewares/validate-request';
import {
  forgotPasswordSchema,
  loginSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  signupSchema,
  verifyEmailSchema,
} from '../schemas/auth-schema';
import { AuthController } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/require-auth';
import { apiLimiter } from '../middlewares/rate-limiter';
import { requireRole } from '../middlewares/require-role';

const router = Router();

router.post('/signup', validateRequest(signupSchema), AuthController.signup);

router.post(
  '/login',
  apiLimiter,
  validateRequest(loginSchema),
  AuthController.login
);

router.post('/logout', AuthController.logout);

router.post('/refresh', AuthController.refresh);

router.post(
  '/verify-email',
  validateRequest(verifyEmailSchema),
  AuthController.verifyEmail
);

router.post(
  '/resend-verification',
  apiLimiter,
  validateRequest(resendVerificationSchema),
  AuthController.resendVerificationEmail
);

router.post(
  '/forgot-password',
  apiLimiter,
  validateRequest(forgotPasswordSchema),
  AuthController.forgotPassword
);

router.post(
  '/reset-password',
  validateRequest(resetPasswordSchema),
  AuthController.resetPassword
);

router.get(
  '/test-auth',
  requireAuth,
  requireRole(['admin']),
  AuthController.testAuth
);

export { router as authRouter };
