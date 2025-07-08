import express, { json } from 'express';
import cookieParser from 'cookie-parser';

import { healthRouter, profileRouter } from './routes';
import { currentUser } from './middlewares/current-user';
import { errorHandler } from './middlewares/error-handler';
import helmet from 'helmet';
import { httpLogger } from './middlewares/http-logger';
import { env } from './config/env';

const app = express();

app.set('trust proxy', 1);
app.use(json());
app.use(helmet());
app.use(httpLogger);
app.use(cookieParser(env.COOKIE_PARSER_SECRET));
app.use(currentUser);

app.use('/api/users', healthRouter);
app.use('/api/users', profileRouter);

app.use(errorHandler);

export { app };
