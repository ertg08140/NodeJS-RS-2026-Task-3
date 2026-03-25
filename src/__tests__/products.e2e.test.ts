import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from '@jest/globals';
import type { FastifyInstance } from 'fastify';
import path from 'path';
import { fileURLToPath } from 'node:url';
import fs from 'fs/promises';
import { initializeFastifyServer } from '../worker.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const newProduct = {
  name: 'Test Product',
  description: 'A test product for E2E testing',
  price: 29.99,
  category: 'Electronics',
  inStock: true,
};

const expectedProduct = {
  name: 'Test Product',
  description: 'A test product for E2E testing',
  price: 29.99,
  category: 'Electronics',
  inStock: true,
  id: expect.any(String),
};

export const createTestServer = async () => {
  const fastify = await initializeFastifyServer(false);
  return fastify;
};

export const clearProductsData = async () => {
  const dataDir = path.join(__dirname, '..', '..', 'data');
  const dbFile = path.join(dataDir, 'products.json');

  await fs.writeFile(dbFile, JSON.stringify([], null, 2));
};

describe('Products API', () => {
  let fastify: FastifyInstance;
  let productId: string;

  beforeAll(async () => {
    fastify = await createTestServer();
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
    await clearProductsData();
  });

  beforeEach(async () => {
    await clearProductsData();
  });

  describe('E2E Product Workflow', () => {
    it('Should return empty products array at the beginning', async () => {
      const response = await fastify.inject({
        method: 'GET',
        url: '/api/products',
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.body);
      expect(data).toHaveLength(0);
    });

    it('Should create a new product', async () => {
      const response = await fastify.inject({
        method: 'POST',
        url: '/api/products',
        payload: newProduct,
      });

      expect(response.statusCode).toBe(201);
      const createdProduct = JSON.parse(response.body);
      expect(createdProduct).toEqual(expectedProduct);

      productId = createdProduct.id;
    });

    it('Should get the created product by ID', async () => {
      const createResponse = await fastify.inject({
        method: 'POST',
        url: '/api/products',
        payload: newProduct,
      });

      const createdProduct = JSON.parse(createResponse.body);
      productId = createdProduct.id;

      const getResponse = await fastify.inject({
        method: 'GET',
        url: `/api/products/${productId}`,
      });

      expect(getResponse.statusCode).toBe(200);
      const retrievedProduct = JSON.parse(getResponse.body);
      expect(retrievedProduct).toEqual(expectedProduct);
    });

    it('Should delete the product by ID', async () => {
      const createResponse = await fastify.inject({
        method: 'POST',
        url: '/api/products',
        payload: newProduct,
      });

      const createdProduct = JSON.parse(createResponse.body);
      productId = createdProduct.id;

      const deleteResponse = await fastify.inject({
        method: 'DELETE',
        url: `/api/products/${productId}`,
      });

      expect(deleteResponse.statusCode).toBe(204);

      const getResponse = await fastify.inject({
        method: 'GET',
        url: `/api/products/${productId}`,
      });

      expect(getResponse.statusCode).toBe(404);
    });
  });
});
