import { afterAll, beforeAll } from 'vitest';

import { rabbitMQConnection } from '../../src/events/connection';

beforeAll(async () => {
  await rabbitMQConnection.connect();
});

afterAll(async () => {
  await rabbitMQConnection.close();
});
