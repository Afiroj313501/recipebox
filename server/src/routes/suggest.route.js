import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { suggest } from '../controllers/suggest.controller.js';

const router = Router();

router.post('/', protect, suggest);

export default router;
