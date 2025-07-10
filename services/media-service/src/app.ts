import express, { json } from 'express';
import { healthRouter, mediaRouter } from './routes';
import helmet from 'helmet';
import { httpLogger } from './middlewares/http-logger';

const app = express();
app.use(json());
app.use(helmet());
app.use(httpLogger);

app.use('/api/media', healthRouter);
app.use('/api/media', mediaRouter);

export { app };
