import { z } from 'zod';

const geminiSuggestionSchema = z.object({
  title: z.string().min(1),
  uses: z.array(z.string()),
  missing: z.array(z.string()),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  timeMinutes: z.number(),
  steps: z.array(z.string()).min(1),
  tags: z.array(z.string()),
});

export const geminiResponseSchema = z.array(geminiSuggestionSchema).length(3);
