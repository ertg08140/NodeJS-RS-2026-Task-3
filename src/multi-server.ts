import cluster from 'node:cluster';
import { startWorker } from './worker.js';
import { startCluster } from './cluster.js';
import 'dotenv/config';

if (cluster.isPrimary) {
  startCluster(cluster);
} else {
  startWorker();
}
