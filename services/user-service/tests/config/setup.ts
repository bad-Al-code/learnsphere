import { beforeAll, afterAll } from "vitest";
import { exec } from "node:child_process";
import { promisify } from "node:util";

import { env } from "../../src/config/env";
import { rabbitMQConnection } from "../../src/events/connection";
import { pool } from "../../src/db";

env.DATABASE_URL = `${env.DATABASE_URL}_test`;

const runMigrations = async () => {
  const execPromise = promisify(exec);
  console.log(`\nMigrating test database: ${env.DATABASE_URL}`);
  try {
    await execPromise("pnpm db:migrate");
    console.log("Test database migration successful.");
  } catch (error) {
    console.error("Test database migration failed:", error);
    process.exit(1);
  }
};

beforeAll(async () => {
  await rabbitMQConnection.connect();
  await runMigrations();
});

afterAll(async () => {
  await pool.end();
  await rabbitMQConnection.close();
});
