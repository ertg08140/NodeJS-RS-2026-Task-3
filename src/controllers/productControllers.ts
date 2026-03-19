import type { FastifyReply, FastifyRequest } from 'fastify';

import * as ProductService from '../services/productServices.js';

export const getAllProducts = (
  _request: FastifyRequest,
  reply: FastifyReply,
) => {
  const allProducts = ProductService.getAllProducts();
  return reply.code(200).send(allProducts);
};
