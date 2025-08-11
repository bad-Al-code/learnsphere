import cookieParser from 'cookie-parser';
import express, { json } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import { currentUser } from './middleware/current-user.middleware';
import { errorHandler } from './middleware/error-handler.middleware';
import { httpLogger } from './middleware/http-logger';
import { healthRouter } from './routes/health.route';
import { paymentRouter } from './routes/payment.route';

const app = express();

app.set('trust proxy', 1);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(json());
app.use(helmet());
app.use(httpLogger);
app.use(cookieParser(env.COOKIE_PARSER_SECRET));
app.use(currentUser);

app.use('/api/payments', healthRouter);
app.use('/api/payments', paymentRouter);

app.use(errorHandler);

export { app };
