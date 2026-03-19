import type { Product } from '../schemas/productSchema.js';

const allProductsDb: Product[] = [];

export const getAllProducts = () => {
  return allProductsDb;
};
