import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.{test,spec}.{js,ts}'],
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/config/setup.ts'],
    hookTimeout: 60000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/index.ts',
        'src/api.ts',
        'src/worker.ts',
        'src/types',
        'src/errors',
        'src/config/health-state.ts',
        'src/events/connection.ts',
      ],
    },
  },
  resolve: {
    alias: {
      zod: require.resolve('zod'),
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
});

process.env.NODE_ENV = 'test';
