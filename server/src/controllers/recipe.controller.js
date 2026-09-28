import Recipe from '../models/Recipe.js';
import Rating from '../models/Rating.js';
import { createRecipeSchema, updateRecipeSchema } from '../validators/recipe.validator.js';

// GET /api/recipes — the logged-in user's OWN recipes (private + public, any status)
export async function getMyRecipes(req, res) {
  const { q, mealType, tags } = req.query;

  const filter = { owner: req.userId };

  if (mealType) {
    filter.mealType = mealType;
  }

  if (tags) {
    const tagList = tags.split(',').map((t) => t.trim().toLowerCase());
    filter.tags = { $in: tagList };
  }

  if (q) {
    filter.$text = { $search: q };
  }

  const recipes = await Recipe.find(filter).sort({ createdAt: -1 });
  res.json({ recipes });
}

// GET /api/recipes/public: approved public recipes from everyone
export async function getPublicRecipes(req, res) {
  const { q, mealType } = req.query;

  const filter = { visibility: 'public', status: 'approved' };
  if (mealType) filter.mealType = mealType;
  if (q) filter.$text = { $search: q };

  const recipes = await Recipe.find(filter)
    .populate('owner', 'name avatarUrl')
    .sort({ createdAt: -1 });

  res.json({ recipes });
}

// GET /api/recipes/:id
export async function getRecipeById(req, res) {
  const recipe = await Recipe.findById(req.params.id).populate('owner', 'name avatarUrl');

  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }

  const isOwner = recipe.owner._id.toString() === req.userId;
  const isPublicApproved = recipe.visibility === 'public' && recipe.status === 'approved';

  if (!isOwner && !isPublicApproved) {
    return res.status(403).json({ error: 'Not authorized to view this recipe' });
  }

  const myRatingDoc = await Rating.findOne({ recipe: recipe._id, user: req.userId });

  res.json({
    recipe: { ...recipe.toObject(), myRating: myRatingDoc?.value ?? null },
  });
}

// POST /api/recipes
export async function createRecipe(req, res) {
  const parsed = createRecipeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const recipe = await Recipe.create({ ...parsed.data, owner: req.userId });
  res.status(201).json({ recipe });
}

// PATCH /api/recipes/:id — owner only
export async function updateRecipe(req, res) {
  const parsed = updateRecipeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  if (recipe.owner.toString() !== req.userId) {
    return res.status(403).json({ error: 'Not authorized to edit this recipe' });
  }

  // Was this recipe already reviewed (approved or rejected) while public?
  const wasReviewed =
    recipe.visibility === 'public' &&
    ['approved', 'rejected'].includes(recipe.status);

  Object.assign(recipe, parsed.data);

  // Any edit to a reviewed public recipe sends it back to the queue.
  // If the owner just switched it to private, the model's pre-save hook handles that instead.
  if (wasReviewed && recipe.visibility === 'public') {
    recipe.status = 'pending';
  }

  await recipe.save();
  res.json({ recipe });
}

// DELETE /api/recipes/:id — owner only
export async function deleteRecipe(req, res) {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  if (recipe.owner.toString() !== req.userId) {
    return res.status(403).json({ error: 'Not authorized to delete this recipe' });
  }

  await recipe.deleteOne();
  res.json({ success: true });
}