import Fastify from 'fastify';
import autoLoad from '@fastify/autoload';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import path from 'path';
import { fileURLToPath } from 'node:url';
import type { FastifyInstance } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  hasZodFastifySchemaValidationErrors,
} from 'fastify-type-provider-zod';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initializeFastifyServer = async (
  logger: boolean = true,
): Promise<FastifyInstance> => {
  const fastify = Fastify({ logger }).withTypeProvider();

  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  fastify.setErrorHandler((error, _request, reply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
      return reply.status(400).send({
        error: 'Validation Error',
        issues: error.validation.map((issue) => ({
          field: issue.instancePath,
          message: issue.message,
        })),
      });
    }
    reply.send(error);
  });

  await fastify.register(swagger, {
    openapi: {
      info: { title: 'RS-NodeJS-Task-3', version: '1.0' },
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
  });

  fastify.register(autoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: { prefix: '/api/products' },
  });

  return fastify;
};

export const startWorker = async () => {
  const fastify = await initializeFastifyServer(true);

  const workerPort = process.env.WORKER_PORT || process.env.SINGLE_SERVER_PORT;

  console.log('object');

  fastify.listen({ port: parseInt(workerPort!) }, () => {
    console.log(`Worker ${process.pid} started on port ${workerPort}`);
  });
};
