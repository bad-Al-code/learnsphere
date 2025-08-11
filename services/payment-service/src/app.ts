import express, { json } from 'express';
import helmet from 'helmet';

import { errorHandler } from './middleware/error-handler.middleware';
import { httpLogger } from './middleware/http-logger';
import { healthRouter } from './routes/health.route';

const app = express();

app.set('trust proxy', 1);
app.use(json());
app.use(helmet());
app.use(httpLogger);

app.use('/api/payments', healthRouter);

app.use(errorHandler);

export { app };
