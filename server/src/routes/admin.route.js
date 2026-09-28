import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';
import {
  getPendingRecipes,
  approveRecipe,
  rejectRecipe,
} from '../controllers/admin.controller.js';

const router = Router();

router.use(protect, requireAdmin); // every admin route needs login AND admin role

router.get('/recipes/pending', getPendingRecipes);
router.patch('/recipes/:id/approve', approveRecipe);
router.patch('/recipes/:id/reject', rejectRecipe);

export default router;