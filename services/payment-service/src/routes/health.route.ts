import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { healthState } from '../config/health-state';

const router = Router();

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
