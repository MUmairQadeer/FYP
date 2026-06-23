import Trip from '../models/Trip.js';
import { generateItinerary } from '../utils/itineraryGenerator.js';

// @desc    Generate a trip itinerary (without saving)
// @route   POST /api/trips/generate
// @access  Private (or Public)
const generateTrip = async (req, res) => {
  const { destination, startDate, endDate, budget, currency, travelStyle, travelers } = req.body;

  if (!destination || !startDate || !endDate || !budget) {
    res.status(400);
    throw new Error('Please fill in all required parameters (destination, dates, budget)');
  }

  try {
    const itineraryData = await generateItinerary({
      destination,
      startDate,
      endDate,
      budget,
      currency: currency || 'USD',
      travelStyle: travelStyle || 'adventure',
      travelers: travelers || 1,
    });

    res.status(200).json(itineraryData);
  } catch (error) {
    res.status(500);
    throw new Error(`Failed to generate itinerary: ${error.message}`);
  }
};

// @desc    Save a generated/custom trip
// @route   POST /api/trips
// @access  Private
const createTrip = async (req, res) => {
  const { destination, startDate, endDate, travelers, budget, currency, travelStyle, itinerary, isPublic } = req.body;

  if (!destination || !startDate || !endDate || !budget) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  const trip = new Trip({
    userId: req.user._id,
    destination,
    startDate,
    endDate,
    travelers: travelers || 1,
    budget,
    currency: currency || 'USD',
    travelStyle: travelStyle || 'adventure',
    itinerary: itinerary || [],
    isPublic: isPublic || false,
  });

  const savedTrip = await trip.save();
  res.status(201).json(savedTrip);
};

// @desc    Get all user's trips
// @route   GET /api/trips
// @access  Private
const getUserTrips = async (req, res) => {
  const trips = await Trip.find({
    $or: [
      { userId: req.user._id },
      { collaborators: req.user._id }
    ]
  }).sort({ createdAt: -1 });

  res.json(trips);
};

// @desc    Get all public trips (for community feed)
// @route   GET /api/trips/public
// @access  Public
const getPublicTrips = async (req, res) => {
  const trips = await Trip.find({ isPublic: true })
    .populate('userId', 'name')
    .sort({ likes: -1, createdAt: -1 });

  res.json(trips);
};

// @desc    Get trip by ID
// @route   GET /api/trips/:id
// @access  Private/Public (Public if isPublic is true, otherwise requires ownership/collaboration)
const getTripById = async (req, res) => {
  const trip = await Trip.findById(req.id || req.params.id)
    .populate('userId', 'name email')
    .populate('collaborators', 'name email');

  if (!trip) {
    res.status(404);
    throw new Error('Trip not found');
  }

  // Check access permissions
  const isOwner = req.user && trip.userId._id.toString() === req.user._id.toString();
  const isCollaborator = req.user && trip.collaborators.some(c => c._id.toString() === req.user._id.toString());
  const isPublic = trip.isPublic;

  if (isPublic || isOwner || isCollaborator) {
    res.json(trip);
  } else {
    res.status(403);
    throw new Error('Not authorized to access this trip');
  }
};

// @desc    Update a trip
// @route   PUT /api/trips/:id
// @access  Private
const updateTrip = async (req, res) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    res.status(404);
    throw new Error('Trip not found');
  }

  // Verify user is owner or collaborator
  const isOwner = trip.userId.toString() === req.user._id.toString();
  const isCollaborator = trip.collaborators.some(c => c.toString() === req.user._id.toString());

  if (!isOwner && !isCollaborator) {
    res.status(403);
    throw new Error('Not authorized to update this trip');
  }

  trip.destination = req.body.destination || trip.destination;
  trip.startDate = req.body.startDate || trip.startDate;
  trip.endDate = req.body.endDate || trip.endDate;
  trip.travelers = req.body.travelers || trip.travelers;
  trip.budget = req.body.budget || trip.budget;
  trip.currency = req.body.currency || trip.currency;
  trip.travelStyle = req.body.travelStyle || trip.travelStyle;
  trip.itinerary = req.body.itinerary || trip.itinerary;
  trip.isPublic = req.body.isPublic !== undefined ? req.body.isPublic : trip.isPublic;
  trip.likes = req.body.likes !== undefined ? req.body.likes : trip.likes;

  // Add collaborators if provided
  if (req.body.collaboratorEmails) {
    // Find users by emails
    const User = (await import('../models/User.js')).default;
    const users = await User.find({ email: { $in: req.body.collaboratorEmails } });
    const userIds = users.map(u => u._id);
    
    // Merge without duplicates
    userIds.forEach(id => {
      if (!trip.collaborators.includes(id)) {
        trip.collaborators.push(id);
      }
    });
  }

  const updatedTrip = await trip.save();
  res.json(updatedTrip);
};

// @desc    Delete a trip
// @route   DELETE /api/trips/:id
// @access  Private
const deleteTrip = async (req, res) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    res.status(404);
    throw new Error('Trip not found');
  }

  // Only owner can delete a trip
  if (trip.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this trip');
  }

  await trip.deleteOne();
  
  // Also clean up any associated expenses
  const Expense = (await import('../models/Expense.js')).default;
  await Expense.deleteMany({ tripId: req.params.id });

  res.json({ message: 'Trip and associated expenses removed' });
};

// @desc    Clone a public trip
// @route   POST /api/trips/:id/clone
// @access  Private
const cloneTrip = async (req, res) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    res.status(404);
    throw new Error('Trip to clone not found');
  }

  if (!trip.isPublic) {
    res.status(400);
    throw new Error('Cannot clone a private trip');
  }

  const clonedTrip = new Trip({
    userId: req.user._id,
    destination: trip.destination,
    startDate: new Date(), // Reset to today or keep same dates
    endDate: new Date(Date.now() + (trip.endDate - trip.startDate)),
    travelers: 1,
    budget: trip.budget,
    currency: trip.currency,
    travelStyle: trip.travelStyle,
    itinerary: trip.itinerary,
    isPublic: false, // Default cloned trip to private
  });

  const savedClonedTrip = await clonedTrip.save();
  res.status(201).json(savedClonedTrip);
};

export {
  generateTrip,
  createTrip,
  getUserTrips,
  getPublicTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  cloneTrip,
};
