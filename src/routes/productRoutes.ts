import * as ProductControllers from '../controllers/productControllers.js';

import type { FastifyInstance } from 'fastify';
import {
  createProductSchema,
  updateProductSchema,
} from '../schemas/productSchema.js';

const productRoutes = (fastify: FastifyInstance) => {
  fastify.get('/', ProductControllers.getAllProducts);
  fastify.get('/:id', ProductControllers.getProductById);
  fastify.delete('/:id', ProductControllers.deleteProductById);
  fastify.post(
    '/',
    { schema: { body: createProductSchema } },
    ProductControllers.createProduct,
  );
  fastify.put(
    '/:id',
    { schema: { body: updateProductSchema } },
    ProductControllers.putProductById,
  );
};

export default productRoutes;
