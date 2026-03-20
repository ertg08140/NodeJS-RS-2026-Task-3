import Fastify from 'fastify';
import replyFrom from '@fastify/reply-from';

import { availableParallelism } from 'node:os';

import type { Cluster } from 'node:cluster';

const PORT = Number(process.env.CLUSTER_SERVER_PORT) || 3000;
const numWorkers = availableParallelism() - 1;

export const startCluster = (cluster: Cluster) => {
  const fastify = Fastify();
  const workerPorts: number[] = [];
  const workerPortsMap = new Map<number, number>();

  for (let i = 1; i <= numWorkers; i++) {
    const workerPort = PORT + i;
    workerPorts.push(workerPort);
    const worker = cluster.fork({ WORKER_PORT: workerPort });
    workerPortsMap.set(worker.id, workerPort);
  }

  cluster.on('exit', (worker) => {
    const deadWorkerPort = workerPortsMap.get(worker.id);
    console.log(
      `Worker ${worker.process.pid} died. Port was: ${deadWorkerPort}`,
    );

    if (deadWorkerPort) {
      cluster.fork({ WORKER_PORT: deadWorkerPort });
    } else {
      console.error('Could not recover worker port!');
    }
  });

  fastify.register(replyFrom);
  let current = 0;

  fastify.all('/*', (request, reply) => {
    const targetPort = workerPorts[current];
    current = (current + 1) % workerPorts.length;

    reply.from(`http://localhost:${targetPort}${request.url}`);
  });

  fastify.listen({ port: PORT }, () => {
    console.log(`Cluster started on http://localhost:${PORT}`);
  });
};
