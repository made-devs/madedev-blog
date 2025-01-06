import express from 'express';
import { allPosts, createPost } from '../controllers/postController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/posts', authMiddleware, createPost);
router.get('/posts', allPosts);

export default router;
