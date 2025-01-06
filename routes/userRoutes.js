import express from 'express';
import { login, register } from '../controllers/userController.js';
import { check } from 'express-validator';

const router = express.Router();

// Auth routes
router.post(
  '/login',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty(),
  ],
  login
);
router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password must be at least 6 characters').isLength({
      min: 6,
    }),
  ],
  register
);

export default router;
