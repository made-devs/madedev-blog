import express from 'express';
import {
  allPosts,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { check } from 'express-validator';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('content', 'Content is required').not().isEmpty(),
    check('author', 'Author is required').not().isEmpty(),
  ],
  createPost
);

router.put(
  '/:id', // Route for updating post based by ID
  authMiddleware,
  [
    check('title', 'Title is required').optional().not().isEmpty(),
    check('content', 'Content is required').optional().not().isEmpty(),
    check('author', 'Author is required').optional().not().isEmpty(),
  ],
  updatePost
);

router.delete('/:id', authMiddleware, deletePost);

router.get('/', allPosts);

export default router;
