import express from 'express';
import { allPosts, createPost } from '../controllers/postController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { check } from 'express-validator';

const router = express.Router();

router.post(
  '/posts',
  authMiddleware,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('content', 'Content is required').not().isEmpty(),
    check('author', 'Author is required').not().isEmpty(),
  ],
  createPost
);
router.get('/posts', allPosts);

export default router;
