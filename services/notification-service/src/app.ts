import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { json } from 'express';
import helmet from 'helmet';

import { env } from './config/env';
import { currentUser } from './middlewares/current-user';
import { errorHandler } from './middlewares/error-handler';
import { notificationRouter } from './routes/notification';

const app = express();

app.set('trust proxy', 1);
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(json());
app.use(helmet());
app.use(cookieParser(env.COOKIE_PARSER_SECRET));
app.use(currentUser);

app.use('/api/notifications', notificationRouter);

app.use(errorHandler);

export { app };
