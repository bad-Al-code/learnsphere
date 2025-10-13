import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { json } from 'express';
import swaggerUi from 'swagger-ui-express';

import helmet from 'helmet';
import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import { aiRouter } from './features/ai/ai.route';
import { flashcardRouter } from './features/ai/flashcards/flashcard.route';
import { noteRouter } from './features/ai/notes/note.route';
import { researchRouter } from './features/ai/research/research.route';
import { writingRouter } from './features/ai/writing/writing.route';
import { integrationRouter } from './features/integrations/integration.route';
import { correlationIdMiddleware } from './middlewares/correlation-id.middleware';
import { currentUser } from './middlewares/current-user';
import { errorHandler } from './middlewares/error-handler';
import { httpLogger } from './middlewares/http-logger';
import { metricsMiddleware } from './middlewares/metrics.middleware';
import {
  healthRouter,
  profileRouter,
  studyGoalRouter,
  waitlistRouter,
} from './routes';
import { analyticsRouter } from './routes/analytics.route';
import { metricsService } from './services/metrics.service';

const app = express();

app.set('trust proxy', 1);
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/users/metrics', async (req, res) => {
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

app.use('/api/ai', aiRouter);
app.use('/api/ai/notes', noteRouter);
app.use('/api/ai/research', researchRouter);
app.use('/api/ai/flashcards', flashcardRouter);
app.use('/api/ai/writing/assignments', writingRouter);

app.use('/api/users/integrations', integrationRouter);

app.use('/api/users', healthRouter);
app.use('/api/users', profileRouter);
app.use('/api/users', studyGoalRouter);
app.use('/api/users/waitlist', waitlistRouter);
app.use('/api/users/analytics', analyticsRouter);

app.use(errorHandler);

export { app };
