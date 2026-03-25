import { z } from 'zod';

const REQUIRED_ERROR_MESSAGE = 'Field is required';
const PRICE_VALUE_ERROR_MESSAGE = 'Price should have positive value';
const SHOULD_BE_NUMBER_ERROR_MESSAGE = 'Should be a number';
const SHOULD_BE_BOOLEAN_ERROR_MESSAGE = 'Should be boolean';

export const baseProductSchema = z.object({
  id: z.string(),
  name: z.string({
    error: REQUIRED_ERROR_MESSAGE,
  }),

  description: z.string({
    error: REQUIRED_ERROR_MESSAGE,
  }),

  price: z
    .number({
      error: (iss) =>
        !iss.input ? REQUIRED_ERROR_MESSAGE : SHOULD_BE_NUMBER_ERROR_MESSAGE,
    })
    .positive({ error: PRICE_VALUE_ERROR_MESSAGE }),

  category: z.string({
    error: REQUIRED_ERROR_MESSAGE,
  }),

  inStock: z.boolean({
    error: (iss) =>
      !iss.input ? REQUIRED_ERROR_MESSAGE : SHOULD_BE_BOOLEAN_ERROR_MESSAGE,
  }),
});

export type Product = z.infer<typeof baseProductSchema>;

export const createProductSchema = baseProductSchema.omit({
  id: true,
});

export type CreateProduct = z.infer<typeof createProductSchema>;

export const updateProductSchema = baseProductSchema
  .omit({
    id: true,
  })
  .partial();

export type UpdateProduct = z.infer<typeof updateProductSchema>;
