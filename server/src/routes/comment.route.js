import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { deleteComment } from '../controllers/comment.controller.js';

const router = Router();

router.delete('/:commentId', protect, deleteComment);

export default router;
