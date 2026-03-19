import { z } from 'zod';

export const productSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(2).max(100),
  description: z.string().min(2),
  price: z.number().int().positive(),
  category: z.string().min(2),
  inStock: z.boolean(),
});
export type Product = z.infer<typeof productSchema>;
