import Fastify from 'fastify';
import autoLoad from '@fastify/autoload';
import path from 'path';
import { fileURLToPath } from 'node:url';
import {
  serializerCompiler,
  validatorCompiler,
  hasZodFastifySchemaValidationErrors,
} from 'fastify-type-provider-zod';

export const startWorker = async () => {
  const app = Fastify({ logger: true }).withTypeProvider();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.setErrorHandler((error, _request, reply) => {
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

  const workerPort = parseInt(process.env.WORKER_PORT!);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.register(autoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: { prefix: '/api/products' },
  });

  app.get('/api', async () => {
    return { message: `Response from worker on port ${workerPort}` };
  });

  app.listen({ port: workerPort }, () => {
    console.log(`Worker ${process.pid} started on port ${workerPort}`);
  });
};
