import { z } from 'zod';
import Rating from '../models/Rating.js';
import Recipe from '../models/Recipe.js';

const rateSchema = z.object({
  value: z.number().int().min(1).max(5),
});

// POST /api/recipes/:id/rate
export async function rateRecipe(req, res) {
  const parsed = rateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Rating must be a whole number from 1 to 5' });
  }
  const { value } = parsed.data;

  const recipe = await Recipe.findById(req.params.id);
  if (!recipe || recipe.visibility !== 'public' || recipe.status !== 'approved') {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  if (recipe.owner.toString() === req.userId) {
    return res.status(403).json({ error: "You can't rate your own recipe" });
  }

  // Create the rating, or update it if this user already rated
  await Rating.findOneAndUpdate(
    { recipe: recipe._id, user: req.userId },
    { value },
    { upsert: true, setDefaultsOnInsert: true }
  );

  // Recompute the average and count from all ratings
  const [stats] = await Rating.aggregate([
    { $match: { recipe: recipe._id } },
    { $group: { _id: '$recipe', avg: { $avg: '$value' }, count: { $sum: 1 } } },
  ]);

  const updated = await Recipe.findByIdAndUpdate(
    recipe._id,
    {
      rating: Math.round(stats.avg * 10) / 10,
      ratingsCount: stats.count,
    },
    { new: true, timestamps: false }
  );

  res.json({
    rating: updated.rating,
    ratingsCount: updated.ratingsCount,
    myRating: value,
  });
}
