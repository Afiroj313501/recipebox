import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getMyRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from '../controllers/recipe.controller.js';

const router = Router();

router.use(protect); // every recipe route requires login

router.get('/', getMyRecipes);
router.post('/', createRecipe);
router.get('/:id', getRecipeById);
router.patch('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);

export default router;