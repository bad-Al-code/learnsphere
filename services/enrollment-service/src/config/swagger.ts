import swaggerJsdoc from 'swagger-jsdoc';

import { env } from './env';

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LearnSphere Enrollment Service API',
      version: '1.0.0',
      description:
        'API for managing student enrollments in courses, tracking progress, and handling administrative enrollment actions.',
    },
    servers: [
      {
        url: `http://localhost:${env.PORT || 8004}`,
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

  apis: ['./src/routes/*.ts', './src/schema/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
