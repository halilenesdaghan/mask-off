import express from 'express';
import multer from 'multer';
import { createPost, getPosts, getPostById } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer'ı bellek depolamasıyla yapılandır (doğrudan S3'e akıtmak için)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.route('/')
  .post(protect, upload.single('media'), createPost)
  .get(getPosts);
  
router.route('/:id').get(getPostById);

export default router;