import express from 'express';
import { addExpense, getTripExpenses, deleteExpense } from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const router = express.Router();

// Mounts directly at:
// POST /api/trips/:id/expenses
// GET /api/trips/:id/expenses
router.route('/trips/:id/expenses')
  .post(protect, asyncHandler(addExpense))
  .get(protect, asyncHandler(getTripExpenses));

// Mounts directly at:
// DELETE /api/expenses/:id
router.route('/expenses/:id')
  .delete(protect, asyncHandler(deleteExpense));

export default router;
