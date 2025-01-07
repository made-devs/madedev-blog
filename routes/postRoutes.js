import express from 'express';
import {
  allPosts,
  createPost,
  updatePost,
  deletePost,
  addComment,
} from '../controllers/postController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { check } from 'express-validator';
import checkRole from '../middlewares/checkRole.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  checkRole('admin'),
  [
    check('title', 'Title is required').not().isEmpty(),
    check('content', 'Content is required').not().isEmpty(),
  ],
  createPost
);

router.post(
  '/:id/comments',
  authMiddleware,
  [check('content', 'Comment content is required').not().isEmpty()],
  addComment
);

router.put(
  '/:id', // Route for updating post based by ID
  authMiddleware,
  checkRole('admin'),
  [
    check('title', 'Title is required').optional().not().isEmpty(),
    check('content', 'Content is required').optional().not().isEmpty(),
  ],
  updatePost
);

router.delete('/:id', authMiddleware, checkRole('admin'), deletePost);

router.get('/', allPosts);

export default router;
