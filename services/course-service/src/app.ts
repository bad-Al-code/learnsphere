import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { json } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import { aiRouter } from './features/ai/ai.route';
import { correlationIdMiddleware } from './middlewares/correlation-id.middleware';
import { currentUser } from './middlewares/current-user';
import { errorHandler } from './middlewares/error-handler';
import { httpLogger } from './middlewares/http-logger';
import { metricsMiddleware } from './middlewares/metrics.middleware';
import {
  analyticsRouter,
  assignmentRouter,
  categoryRouter,
  courseRouter,
  draftRouter,
  healthRouter,
  lessonRouter,
  moduleRouter,
  resourceRouter,
} from './routes';
import { metricsService } from './services/metrics.service';

const app = express();

app.set('trust proxy', true);
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/courses/metrics', async (req, res) => {
  res.set('Content-Type', metricsService.register.contentType);
  res.end(await metricsService.register.metrics());
});

app.use(json());
app.use(helmet());
app.use(correlationIdMiddleware);
app.use(httpLogger);
app.use(metricsMiddleware);
app.use(cookieParser(env.COOKIE_PARSER_SECRET));
app.use(currentUser);

app.use('/api/courses', healthRouter);
app.use('/api/courses', courseRouter);
app.use('/api/modules', moduleRouter);
app.use('/api/lessons', lessonRouter);
app.use('/api/categories', categoryRouter);
app.use('/api', assignmentRouter);
app.use('/api', resourceRouter);
app.use('/api/assignments/drafts', draftRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/ai-feedback', aiRouter);

app.use(errorHandler);

export { app };
