import swaggerJsdoc from 'swagger-jsdoc';

import { env } from './env';

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LearnSphere User Service API',
      version: '1.0.0',
      description:
        'API documentation for the LearnSphere User & Profile Management Service. Handles creating, updating, and retrieving user profiles.',
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
        },
      },
    },
  },

  apis: [
    './src/routes/*.ts',
    './src/schemas/*.ts',
    './src/features/ai/notes/*.schema.ts',
    './src/features/ai/notes/*.route.ts',
    './src/features/ai/ai.schema.ts',
    './src/features/ai/ai.route.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
