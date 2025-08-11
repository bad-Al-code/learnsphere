import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { healthState } from '../config/health-state';

const router = Router();

/**
 * @openapi
 * /api/payments/health:
 *   get:
 *     tags: [Health]
 *     summary: Check the health of the service
 *     description: Returns the operational status of the payment service and its critical dependencies.
 *     responses:
 *       '200':
 *         description: Service is healthy and running.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: UP
 *                 message:
 *                   type: string
 *                   example: Payment service is up and running
 *       '503':
 *         description: Service is unhealthy or one of its dependencies is down.
 */
router.get('/health', (req: Request, res: Response) => {
  if (healthState.isReady()) {
    res
      .status(StatusCodes.OK)
      .json({ status: 'UP', message: 'Payment service is up and running' });
  } else {
    res
      .status(StatusCodes.SERVICE_UNAVAILABLE)
      .json({ status: 'DOWN', message: 'Payment service is not ready' });
  }
});

export { router as healthRouter };
