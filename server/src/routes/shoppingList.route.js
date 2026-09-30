import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getShoppingList,
  addFromRecipes,
  updateItem,
  deleteItem,
} from '../controllers/shoppingList.controller.js';

const router = Router();

router.use(protect);

router.get('/', getShoppingList);
router.post('/from-recipes', addFromRecipes);
router.patch('/:itemId', updateItem);
router.delete('/:itemId', deleteItem);

export default router;