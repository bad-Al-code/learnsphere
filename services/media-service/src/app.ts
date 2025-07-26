import express, { json } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { healthRouter, mediaRouter } from './routes';
import { httpLogger } from './middlewares/http-logger';
import { swaggerSpec } from './config/swagger';

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(json());
app.use(helmet());
app.use(httpLogger);

app.use('/api/media', healthRouter);
app.use('/api/media', mediaRouter);

export { app };
