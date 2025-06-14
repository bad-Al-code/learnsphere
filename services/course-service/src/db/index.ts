import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import logger from "../config/logger";
import * as schema from "./schema";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  logger.info("User-service database connected succesfully");
});

pool.on("error", (err) => {
  logger.error(`Database connection error: `, { error: err.stack });
  process.exit(1);
});

export const db = drizzle(pool, {
  schema,
  logger: process.env.NODE_ENV === "development",
});
