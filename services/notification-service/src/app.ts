import express, { json } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { currentUser } from './middlewares/current-user';
import { errorHandler } from './middlewares/error-handler';

const app = express();

app.set('trust proxy', 1);
app.use(json());
app.use(helmet());
app.use(cookieParser(env.COOKIE_PARSER_SECRET));
app.use(currentUser);

app.use(errorHandler);

export { app };
