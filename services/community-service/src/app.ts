import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env';

const app = express();

app.set('trust proxy', 1);
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cookieParser(env.COOKIE_PARSER_SECRET));

app.get('/api/community/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

export { app };
