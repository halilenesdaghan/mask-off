import express from 'express';
import multer from 'multer';
import { createPost, getPosts, getPostById, likePost } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import { getCommentsForPost, createComment } from '../controllers/commentController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Gönderi Rotaları
router.route('/')
  .get(getPosts)
  .post(protect, upload.single('media'), createPost);

router.route('/:id')
  .get(getPostById);
  
router.route('/:id/like')
  .post(likePost); // Şimdilik korumasız, istenirse protect eklenebilir

// Yorum Rotaları (Gönderi ile ilişkili olduğu için burada)
router.route('/:id/comments')
    .get(getCommentsForPost)
    .post(protect, createComment);

export default router;