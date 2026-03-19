import * as ProductControllers from '../controllers/productControllers.js';

import type { FastifyInstance } from 'fastify';

const productRoutes = (fastify: FastifyInstance) => {
  fastify.get('/', ProductControllers.getAllProducts);
};

export default productRoutes;
