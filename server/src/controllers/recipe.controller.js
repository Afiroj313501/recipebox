import Recipe from '../models/Recipe.js';
import { createRecipeSchema, updateRecipeSchema } from '../validators/recipe.validator.js';

// GET /api/recipes — the logged-in user's OWN recipes (private + public, any status)
export async function getMyRecipes(req, res) {
  const recipes = await Recipe.find({ owner: req.userId }).sort({ createdAt: -1 });
  res.json({ recipes });
}

// GET /api/recipes/:id — must be the owner (private recipe details aren't public)
export async function getRecipeById(req, res) {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }

  const isOwner = recipe.owner.toString() === req.userId;
  const isPublicApproved = recipe.visibility === 'public' && recipe.status === 'approved';

  if (!isOwner && !isPublicApproved) {
    return res.status(403).json({ error: 'Not authorized to view this recipe' });
  }

  res.json({ recipe });
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

  Object.assign(recipe, parsed.data);
  await recipe.save(); // triggers the visibility/status pre-save hook
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