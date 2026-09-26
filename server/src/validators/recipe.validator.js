import { z } from 'zod';

const ingredientSchema = z.object({
  name: z.string().min(1),
  qty: z.number().optional(),
  unit: z.string().optional(),
  raw: z.string().optional(),
});

export const createRecipeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  cuisine: z.string().optional(),
  tags: z.array(z.string()).optional(),
  servings: z.number().optional(),
  prepMinutes: z.number().optional(),
  cookMinutes: z.number().optional(),
  ingredients: z.array(ingredientSchema).min(1, 'At least one ingredient is required'),
  steps: z.array(z.string()).min(1, 'At least one step is required'),
  visibility: z.enum(['private', 'public']).optional(),
});

// Same as create, but every field optional (for PATCH)
export const updateRecipeSchema = createRecipeSchema.partial();