import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

// import * as schema from "./schema";
import logger from "../config/logger";

if (!process.env.DATABASE_URL) {
  throw new Error(`DATABASE_URL environemnt variable is not set.`);
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  logger.info(`Database connected successfully`);
});

pool.on("error", (err) => {
  logger.error("Database connection error", { error: err.stack });
  process.exit(1);
});

export const db = drizzle(pool, {
  // schema,
  logger: process.env.NODE_ENV === "development",
});
