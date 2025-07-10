import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LearnSphere Media Service API',
      version: '1.0.0',
      description:
        'API for hadnling media uploads and processing. This service provides endpoints tog enerate presigned URLs for direct client uploads to S3.',
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/schemas/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
