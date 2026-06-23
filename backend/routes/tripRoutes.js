import express from 'express';
import {
  generateTrip,
  createTrip,
  getUserTrips,
  getPublicTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  cloneTrip,
} from '../controllers/tripController.js';
import { protect } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const router = express.Router();

// Public route for community feed exploration
router.get('/public', asyncHandler(getPublicTrips));

// Protected trip management routes
router.post('/generate', protect, asyncHandler(generateTrip));
router.route('/')
  .post(protect, asyncHandler(createTrip))
  .get(protect, asyncHandler(getUserTrips));

router.route('/:id')
  .get(protect, asyncHandler(getTripById))
  .put(protect, asyncHandler(updateTrip))
  .delete(protect, asyncHandler(deleteTrip));

router.post('/:id/clone', protect, asyncHandler(cloneTrip));

export default router;
