import cors from 'cors';
import express, { json } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from './config/swagger';
import { httpLogger } from './middlewares/http-logger';
import { healthRouter, mediaRouter } from './routes';

const app = express();
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

app.use('/api/media', healthRouter);
app.use('/api/media', mediaRouter);

export { app };
