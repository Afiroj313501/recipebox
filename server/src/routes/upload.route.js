import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import upload from '../config/multer.js';
import { uploadImage } from '../controllers/upload.controller.js';

const router = Router();

router.post('/', protect, upload.single('image'), uploadImage);

export default router;