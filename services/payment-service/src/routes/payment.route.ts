import { Router } from 'express';

import { PaymentController } from '../controllers/payment.controller';
import { requireAuth } from '../middleware/require-auth';
import { requireRole } from '../middleware/require-role';
import { validateRequest } from '../middleware/validate-request.middleware';
import { createOrderSchema } from '../schemas/payment.schema';

const router = Router();

/**
 * @openapi
 * /api/payments/create-order:
 *   post:
 *     summary: Create a payment order for a course
 *     tags: [Payments]
 *     security:
 *       - cookieAuth: []
 *     description: Initiates a payment by creating an order with Razorpay and returns the order details to the client.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderPayload'
 *     responses:
 *       '201':
 *         description: Order created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateOrderResponse'
 *       '400':
 *         description: Bad Request (e.g., course is free, invalid input).
 *       '401':
 *         description: Unauthorized.
 *       '404':
 *         description: Course not found.
 */
router.post(
  '/create-order',
  requireAuth,
  validateRequest(createOrderSchema),
  PaymentController.createOrder
);

/**
 * @openapi
 * /api/payments/webhook:
 *   post:
 *     summary: Handle incoming webhooks from Razorpay
 *     tags: [Payments]
 *     description: Endpoint for Razorpay to send payment status updates. This should not be called by clients directly.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: The webhook payload from Razorpay.
 *     parameters:
 *       - in: header
 *         name: X-Razorpay-Signature
 *         required: true
 *         schema:
 *           type: string
 *         description: The signature to verify the webhook's authenticity.
 *     responses:
 *       '200':
 *         description: Webhook received and acknowledged.
 *       '400':
 *         description: Invalid signature or missing data.
 */
router.post('/webhook', PaymentController.handleWebhook);

/**
 * @openapi
 * /api/payments/analytics/instructor/revenue-breakdown:
 *   get:
 *     summary: "[Instructor] Get a breakdown of revenue sources"
 *     tags: [Payments]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: An array of objects representing revenue sources.
 */
router.get(
  '/analytics/instructor/revenue-breakdown',
  requireAuth,
  requireRole(['instructor', 'admin']),
  PaymentController.getRevenueBreakdown
);

/**
 * @openapi
 * /api/payments/analytics/instructor/financials:
 *   get:
 *     summary: "[Instructor] Get monthly financial performance trends"
 *     tags: [Payments]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: An array of monthly financial data.
 */
router.get(
  '/analytics/instructor/financials',
  requireAuth,
  requireRole(['instructor', 'admin']),
  PaymentController.getFinancialTrends
);

/**
 * @openapi
 * /api/payments/analytics/course/{courseId}/revenue:
 *   get:
 *     summary: "[Internal] Get total revenue for a single course"
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200':
 *         description: The total revenue for the course.
 */
router.get(
  '/analytics/course/:courseId/revenue',
  PaymentController.getCourseRevenue
);

export { router as paymentRouter };
