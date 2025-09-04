import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { json } from 'express';
import swaggerUi from 'swagger-ui-express';

import helmet from 'helmet';
import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import { currentUser } from './middlewares/current-user';
import { errorHandler } from './middlewares/error-handler';
import { httpLogger } from './middlewares/http-logger';
import { healthRouter, profileRouter } from './routes';

const app = express();

app.set('trust proxy', 1);
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(json());
app.use(helmet());
app.use(httpLogger);
app.use(cookieParser(env.COOKIE_PARSER_SECRET));
app.use(currentUser);

app.use('/api/users', healthRouter);
app.use('/api/users', profileRouter);

app.use(errorHandler);

export { app };
