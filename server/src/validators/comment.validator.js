import { z } from 'zod';

export const createCommentSchema = z.object({
  text: z.string().min(1, 'Comment cannot be empty').max(1000),
});
