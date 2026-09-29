import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { getUserProfile } from '../controllers/user.controller.js';

const router = Router();

router.get('/:id', protect, getUserProfile);

export default router;
