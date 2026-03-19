import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

import type {
  CreateProduct,
  Product,
  UpdateProduct,
} from '../schemas/productSchema.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'products.json');

await fs.mkdir(DATA_DIR, { recursive: true });

try {
  await fs.access(DB_FILE);
} catch {
  await fs.writeFile(DB_FILE, JSON.stringify([], null, 2));
}

const readProducts = async (): Promise<Product[]> => {
  const data = await fs.readFile(DB_FILE, 'utf-8');
  return JSON.parse(data);
};

const writeProducts = async (products: Product[]) => {
  await fs.writeFile(DB_FILE, JSON.stringify(products, null, 2));
};

export const getAllProducts = async (): Promise<Product[]> => {
  return readProducts();
};

export const findProductById = async (id: string) => {
  const products = await readProducts();

  return products.find((product) => product.id === id);
};

export const addNewProduct = async (newProduct: CreateProduct) => {
  const products = await readProducts();
  const productWithId = { ...newProduct, id: randomUUID() };
  products.push(productWithId);
  await writeProducts(products);
  return productWithId;
};

export const removeProductById = async (id: string) => {
  const products = await readProducts();
  const productIndx = products.findIndex((product) => product.id === id);

  if (productIndx === -1) {
    return false;
  } else {
    const newProducts = products.filter((product) => product.id !== id);
    await writeProducts(newProducts);
    return true;
  }
};

export const updateProductById = async (
  id: string,
  productUpdates: UpdateProduct,
) => {
  const products = await readProducts();
  const productIndx = products.findIndex((product) => product.id === id);

  if (productIndx === -1) {
    return null;
  } else {
    const newProducts = products.filter((product) => product.id !== id);
    const updatedProduct = {
      ...products[productIndx],
      ...productUpdates,
    } as Product;
    await writeProducts([...newProducts, updatedProduct]);
    return updatedProduct;
  }
};
