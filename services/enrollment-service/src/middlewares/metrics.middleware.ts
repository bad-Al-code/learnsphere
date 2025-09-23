import { NextFunction, Request, Response } from 'express';

import { metricsService } from '../services/metrics.service';

export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const end = metricsService.httpRequestDurationMicroseconds.startTimer();

  res.on('finish', () => {
    const route = req.route ? req.route.path : req.path;

    const labels = {
      method: req.method,
      route: route,
      status_code: res.statusCode,
    };

    metricsService.httpRequestsTotal.inc(labels);

    end(labels);
  });

  next();
};
