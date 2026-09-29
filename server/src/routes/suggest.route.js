import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { suggestLimiter } from '../middleware/rateLimit.middleware.js';
import { suggest } from '../controllers/suggest.controller.js';

const router = Router();

router.post('/', protect, suggestLimiter, suggest);

export default router;
