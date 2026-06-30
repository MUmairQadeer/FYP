import express from 'express';
import {
  registerUser,
  authUser,
  googleAuth,
  getUserProfile,
  updateUserProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const router = express.Router();

router.post('/register', asyncHandler(registerUser));
router.post('/login', asyncHandler(authUser));
router.post('/google', asyncHandler(googleAuth));
router.route('/me').get(protect, asyncHandler(getUserProfile));
router.route('/profile').put(protect, asyncHandler(updateUserProfile));

export default router;

