import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.{test,spec}.{js,ts}'],
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/config/setup.ts'],
    hookTimeout: 400000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/index.ts',
        'src/db/migrate.ts',
        'src/types',
        'src/config/health-state.ts',
        'src/app.ts',
        'src/errors',
      ],
    },
  },

  // resolve: {
  //   alias: {
  //     "@": new URL("./src", import.meta.url).pathname,
  //   },
  // },
});

process.env.NODE_ENV = 'test';
