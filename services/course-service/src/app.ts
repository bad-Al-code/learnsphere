import cookieParser from 'cookie-parser';
import express, { json } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import { currentUser } from './middlewares/current-user';
import { errorHandler } from './middlewares/error-handler';
import { httpLogger } from './middlewares/http-logger';
import {
  categoryRouter,
  courseRouter,
  healthRouter,
  lessonRouter,
  moduleRouter,
} from './routes';

const app = express();

app.set('trust proxy', true);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(json());
app.use(helmet());
app.use(httpLogger);
app.use(cookieParser(env.COOKIE_PARSER_SECRET));
app.use(currentUser);

app.use('/api/courses', healthRouter);
app.use('/api/courses', courseRouter);
app.use('/api/modules', moduleRouter);
app.use('/api/lessons', lessonRouter);
app.use('/api/categories', categoryRouter);

app.use(errorHandler);

export { app };
