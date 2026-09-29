import User from '../models/User.js';
import Recipe from '../models/Recipe.js';

// GET /api/users/:id
export async function getUserProfile(req, res) {
  const user = await User.findById(req.params.id).select('name avatarUrl createdAt');
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const recipes = await Recipe.find({
    owner: req.params.id,
    visibility: 'public',
    status: 'approved',
  }).sort({ createdAt: -1 });

  res.json({ user, recipes });
}
