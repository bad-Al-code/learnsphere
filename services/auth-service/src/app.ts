import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { json, Request, Response } from 'express';
import helmet from 'helmet';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import { metricsService } from './controllers/metrics-service';
import { correlationIdMiddleware } from './middlewares/correlation-id.middleware';
import { currentUser } from './middlewares/current-user';
import { errorHandler } from './middlewares/error-handler';
import { httpLogger } from './middlewares/http-logger';
import { metricsRecorder } from './middlewares/metrics-recorder';
import { authRouter, healthRouter } from './routes';

const app = express();

app.set('trust proxy', 1);
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/metrics', async (req: Request, res: Response) => {
  res.set('Content-Type', metricsService.register.contentType);
  res.end(await metricsService.register.metrics());
});

app.use(json());
app.use(passport.initialize());
app.use(helmet());
app.use(correlationIdMiddleware);
app.use(httpLogger);
app.use(cookieParser(env.COOKIE_PARSER_SECRET));
app.use(metricsRecorder);
app.use(currentUser);

app.use('/api/auth', healthRouter);
app.use('/api/auth', authRouter);

app.use(errorHandler);

export { app };
