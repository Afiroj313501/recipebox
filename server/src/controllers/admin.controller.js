import Recipe from '../models/Recipe.js';

// GET /api/admin/recipes/pending
export async function getPendingRecipes(req, res) {
  console.log('🔎 pending queue requested by user', req.userId);

  const recipes = await Recipe.find({ visibility: 'public', status: 'pending' })
    .populate('owner', 'name avatarUrl')
    .sort({ createdAt: 1 });

  console.log('🔎 pending recipes found:', recipes.length);
  res.json({ recipes });
}

async function setStatus(req, res, status) {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  if (recipe.visibility !== 'public') {
    return res.status(400).json({ error: 'Only public recipes can be reviewed' });
  }

  recipe.status = status;
  await recipe.save();
  res.json({ recipe });
}

// PATCH /api/admin/recipes/:id/approve
export function approveRecipe(req, res) {
  return setStatus(req, res, 'approved');
}

// PATCH /api/admin/recipes/:id/reject
export function rejectRecipe(req, res) {
  return setStatus(req, res, 'rejected');
}