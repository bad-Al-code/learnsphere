import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { env, swaggerSpec } from './config';
import {
  correlationIdMiddleware,
  currentUser,
  errorHandler,
  httpLogger,
  metricsMiddleware,
} from './middlewares';
import {
  analyticsRouter,
  chatRouter,
  eventRouter,
  healthRouter,
  mentorshipRouter,
} from './routes';
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

app.use(express.json());
app.use(helmet());
app.use(correlationIdMiddleware);
app.use(httpLogger);
app.use(metricsMiddleware);
app.use(cookieParser(env.COOKIE_PARSER_SECRET));
app.use(currentUser);

app.get('/api/community/metrics', async (req, res) => {
  res.set('Content-Type', metricsService.register.contentType);

  res.end(await metricsService.register.metrics());
});

app.use('/api/community', healthRouter);
app.use('/api/community', chatRouter);
app.use('/api/community', analyticsRouter);
app.use('/api/community/events', eventRouter);
app.use('/api/community/mentorships', mentorshipRouter);

app.use(errorHandler);

export { app };
