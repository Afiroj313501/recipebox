import { z } from 'zod';

export const suggestSchema = z.object({
  ingredients: z.array(z.string().min(1)).min(1, 'Add at least one ingredient'),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  filters: z
    .object({
      vegetarian: z.boolean().optional(),
      maxTime: z.number().optional(),
    })
    .optional(),
});
