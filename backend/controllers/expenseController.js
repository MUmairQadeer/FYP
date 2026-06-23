import Expense from '../models/Expense.js';
import Trip from '../models/Trip.js';

// @desc    Add actual expense log
// @route   POST /api/trips/:id/expenses
// @access  Private
const addExpense = async (req, res) => {
  const { title, amount, currency, category, date } = req.body;
  const tripId = req.params.id;

  if (!title || !amount || !category) {
    res.status(400);
    throw new Error('Please fill in all required fields (title, amount, category)');
  }

  const trip = await Trip.findById(tripId);

  if (!trip) {
    res.status(404);
    throw new Error('Associated trip not found');
  }

  // Verify access
  const isOwner = trip.userId.toString() === req.user._id.toString();
  const isCollaborator = trip.collaborators.some(c => c.toString() === req.user._id.toString());

  if (!isOwner && !isCollaborator) {
    res.status(403);
    throw new Error('Not authorized to log expenses for this trip');
  }

  const expense = new Expense({
    tripId,
    title,
    amount,
    currency: currency || trip.currency,
    category,
    date: date || new Date(),
  });

  const savedExpense = await expense.save();
  res.status(201).json(savedExpense);
};

// @desc    Get all actual expenses logged for a trip
// @route   GET /api/trips/:id/expenses
// @access  Private
const getTripExpenses = async (req, res) => {
  const tripId = req.params.id;
  const trip = await Trip.findById(tripId);

  if (!trip) {
    res.status(404);
    throw new Error('Associated trip not found');
  }

  // Verify access
  const isOwner = trip.userId.toString() === req.user._id.toString();
  const isCollaborator = trip.collaborators.some(c => c.toString() === req.user._id.toString());
  const isPublic = trip.isPublic;

  if (!isPublic && !isOwner && !isCollaborator) {
    res.status(403);
    throw new Error('Not authorized to access expenses for this trip');
  }

  const expenses = await Expense.find({ tripId }).sort({ date: -1 });
  
  // Calculate summary metadata
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const categoryBreakdown = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  res.json({
    expenses,
    summary: {
      budgetLimit: trip.budget,
      totalSpent,
      remaining: trip.budget - totalSpent,
      overBudget: totalSpent > trip.budget,
      categoryBreakdown
    }
  });
};

// @desc    Delete a logged expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    res.status(404);
    throw new Error('Expense log not found');
  }

  const trip = await Trip.findById(expense.tripId);
  if (!trip) {
    res.status(404);
    throw new Error('Associated trip not found');
  }

  // Verify access
  const isOwner = trip.userId.toString() === req.user._id.toString();
  const isCollaborator = trip.collaborators.some(c => c.toString() === req.user._id.toString());

  if (!isOwner && !isCollaborator) {
    res.status(403);
    throw new Error('Not authorized to delete expenses for this trip');
  }

  await expense.deleteOne();
  res.json({ message: 'Expense log removed' });
};

export { addExpense, getTripExpenses, deleteExpense };
