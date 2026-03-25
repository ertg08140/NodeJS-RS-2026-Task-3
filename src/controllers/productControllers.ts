import type { FastifyReply, FastifyRequest } from 'fastify';

import * as ProductService from '../services/productServices.js';
import {
  createProductSchema,
  updateProductSchema,
} from '../schemas/productSchema.js';
import { isValidUUID } from '../utils.ts/index.js';

export const getAllProducts = async (
  _request: FastifyRequest,
  reply: FastifyReply,
) => {
  const allProducts = await ProductService.getAllProducts();
  return reply.code(200).send(allProducts);
};

export const createProduct = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const validatedBody = createProductSchema.parse(request.body);
  const newProduct = await ProductService.addNewProduct(validatedBody);
  return reply.code(201).send(newProduct);
};

export const getProductById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const productId = request.params.id;

  if (!isValidUUID(productId)) {
    reply.code(400).send({ message: 'Bad id' });
  }

  const product = await ProductService.findProductById(productId);
  if (!product) {
    reply.code(404).send({ message: 'Not Found' });
  }
  return reply.code(200).send(product);
};

export const deleteProductById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const productId = request.params.id;

  if (!isValidUUID(productId)) {
    reply.code(400).send({ message: 'Bad id' });
  }

  const result = await ProductService.removeProductById(productId);
  if (!result) {
    reply.code(404).send({ message: 'Not Found' });
  }
  return reply.code(204).send();
};

export const putProductById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const productId = request.params.id;

  if (!isValidUUID(productId)) {
    reply.code(400).send({ message: 'Bad id' });
  }

  const validatedBody = updateProductSchema.parse(request.body);
  const updatedProduct = await ProductService.updateProductById(
    productId,
    validatedBody,
  );
  if (!updatedProduct) {
    reply.code(404).send({ message: 'Not Found' });
  }
  return reply.code(200).send(updatedProduct);
};
