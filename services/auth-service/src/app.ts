import express, { json, Request, Response } from 'express';
import cookieParser from 'cookie-parser';

import { errorHandler } from './middlewares/error-handler';
import { authRouter, healthRouter } from './routes';
import { httpLogger } from './middlewares/http-logger';
import { currentUser } from './middlewares/current-user';
import helmet from 'helmet';
import { metricsRecorder } from './middlewares/metrics-recorder';
import { metricsService } from './controllers/metrics-service';
import { env } from './config/env';

const app = express();

app.set('trust proxy', 1);

app.get('/metrics', async (req: Request, res: Response) => {
  res.set('Content-Type', metricsService.register.contentType);
  res.end(await metricsService.register.metrics());
});

app.use(json());
app.use(helmet());
app.use(httpLogger);
app.use(cookieParser(env.COOKIE_PARSER_SECRET));
app.use(metricsRecorder);
app.use(currentUser);

app.use('/api/auth', healthRouter);
app.use('/api/auth', authRouter);

app.use(errorHandler);

export { app };
