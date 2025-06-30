import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import logger from "../config/logger";
import * as schema from "./schema";
import { healthState } from "../config/health-state";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  logger.info("User-service database connected succesfully");
  healthState.set("db", true);
});

pool.on("error", (err) => {
  logger.error(`Database connection error: `, { error: err.stack });
  healthState.set("db", false);
  process.exit(1);
});

export const db = drizzle(pool, {
  schema,
  logger: process.env.NODE_ENV === "development",
});
