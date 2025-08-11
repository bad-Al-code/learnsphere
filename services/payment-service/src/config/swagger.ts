import swaggerJsdoc from 'swagger-jsdoc';

import { env } from './env';

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LearnSphere Payment Service API',
      version: '1.0.0',
      description:
        'API for creating and verifying course payments with Razorpay.',
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

    tags: [
      {
        name: 'Payments',
        description: 'Operations related to creating and managing payments.',
      },
      {
        name: 'Health',
        description: 'Service health check endpoints.',
      },
    ],
  },

  apis: ['./src/routes/*.ts', './src/schemas/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
