import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import { correlationIdMiddleware } from './middlewares/correlation-id.middleware';
import { currentUser } from './middlewares/current-user';
import { errorHandler } from './middlewares/error-handler';
import { httpLogger } from './middlewares/http-logger';
import { metricsMiddleware } from './middlewares/metrics.middleware';
import { chatRouter } from './routes/chat.route';
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

app.get('/api/community/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

app.get('/api/community/metrics', async (req, res) => {
  res.set('Content-Type', metricsService.register.contentType);

  res.end(await metricsService.register.metrics());
});

app.use('/api/community', chatRouter);

app.use(errorHandler);

export { app };
