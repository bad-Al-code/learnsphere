import express, { json } from "express";
import cookieParser from "cookie-parser";

import { errorHandler } from "./middlewares/error-handler";
import { httpLogger } from "./middlewares/http-logger";
import { currentUser } from "./middlewares/current-user";
import helmet from "helmet";

const app = express();

app.use(json());
app.use(helmet());
app.use(httpLogger);
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));
app.use(currentUser);

app.use(errorHandler);

export { app };
