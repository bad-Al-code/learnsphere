import { exec } from "node:child_process";
import { promisify } from "node:util";
import { beforeAll, afterAll, afterEach } from "vitest";

const runMigrations = async () => {
  const execPromise = promisify(exec);
  process.env.DATABASE_URL = `${process.env.DATABASE_URL}_test`;
  await execPromise("pnpm db:migrate");
};

beforeAll(async () => {
  await runMigrations();
});

afterEach(async () => {});

afterAll(async () => {});
