import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { json } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from './config/swagger';
import { correlationIdMiddleware } from './middlewares/correlation-id.middleware';
import { currentUser } from './middlewares/current-user';
import { errorHandler } from './middlewares/error-handler';
import { httpLogger } from './middlewares/http-logger';
import { metricsMiddleware } from './middlewares/metrics.middleware';
import { analyticsRouter } from './routes/analytics.route';
import { enrollmentRouter } from './routes/enrollment.routes';
import { healthRouter } from './routes/health';
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
app.get('/api/courses/metrics', async (req, res) => {
  res.set('Content-Type', metricsService.register.contentType);
  res.end(await metricsService.register.metrics());
});

app.use(json());
app.use(helmet());
app.use(correlationIdMiddleware);
app.use(httpLogger);
app.use(metricsMiddleware);
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));
app.use(currentUser);

app.use('/api/enrollments', healthRouter);
app.use('/api/enrollments', enrollmentRouter);
app.use('/api/analytics', analyticsRouter);

app.use(errorHandler);

export { app };
