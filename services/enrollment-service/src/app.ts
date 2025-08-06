import cookieParser from 'cookie-parser';
import express, { json } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from './config/swagger';
import { currentUser } from './middlewares/current-user';
import { errorHandler } from './middlewares/error-handler';
import { httpLogger } from './middlewares/http-logger';
import { analyticsRouter } from './routes/analytics.route';
import { enrollmentRouter } from './routes/enrollment.routes';
import { healthRouter } from './routes/health';

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(json());
app.use(helmet());
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));
app.use(httpLogger);
app.use(currentUser);

app.use('/api/enrollments', healthRouter);
app.use('/api/enrollments', enrollmentRouter);
app.use('/api/analytics', analyticsRouter);

app.use(errorHandler);

export { app };
