import express from 'express';
import {
  allPosts,
  createPost,
  updatePost,
  deletePost,
  addComment,
  allComments,
  deleteComment,
} from '../controllers/postController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { check } from 'express-validator';
import checkRole from '../middlewares/checkRole.js';

const router = express.Router();

router.get('/', allPosts);

router.get('/:postId/comments', allComments);

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
  '/:postId/comments',
  authMiddleware,
  [check('content', 'Comment content is required').not().isEmpty()],
  addComment
);

router.put(
  '/:postId', // Route for updating post based by ID
  authMiddleware,
  checkRole('admin'),
  [
    check('title', 'Title is required').optional().not().isEmpty(),
    check('content', 'Content is required').optional().not().isEmpty(),
  ],
  updatePost
);

router.delete('/:postId', authMiddleware, checkRole('admin'), deletePost);

router.delete('/:postId/comments/:commentId', authMiddleware, deleteComment);

export default router;
