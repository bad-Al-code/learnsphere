import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { healthState } from '../config/health-state';

const router = express.Router();

router.get('/health', (req: Request, res: Response) => {
  if (healthState.isReady()) {
    res
      .status(StatusCodes.OK)
      .json({ status: 'UP', message: 'Course service is up and running' });
  } else {
    res
      .status(StatusCodes.SERVICE_UNAVAILABLE)
      .json({ status: 'DOWN', message: 'Course service is up and running' });
  }
});

export { router as healthRouter };
