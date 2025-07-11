import express, { json } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';

const app = express();

app.use(json());
app.use(helmet());
app.use(cookieParser(env.COOKIE_PARSER_SECRET));

export { app };
