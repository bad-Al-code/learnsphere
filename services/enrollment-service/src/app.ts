import express, { json } from 'express';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';

import { errorHandler } from './middlewares/error-handler';
import { currentUser } from './middlewares/current-user';
import { healthRouter } from './routes/health';
import { httpLogger } from './middlewares/http-logger';
import { enrollmentRouter } from './routes/enrollment.routes';
import { swaggerSpec } from './config/swagger';

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(json());
app.use(helmet());
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));
app.use(httpLogger);
app.use(currentUser);

app.use('/api/enrollments', healthRouter);
app.use('/api/enrollments', enrollmentRouter);

app.use(errorHandler);

export { app };
