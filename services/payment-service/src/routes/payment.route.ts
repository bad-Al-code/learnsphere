import { Router } from 'express';

import { PaymentController } from '../controllers/payment.controller';
import { requireAuth } from '../middleware/require-auth';
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

export { router as paymentRouter };
