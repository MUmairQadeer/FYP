import mongoose from 'mongoose';

const activitySchema = mongoose.Schema({
  timeSlot: {
    type: String,
    enum: ['Morning', 'Afternoon', 'Evening'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  costEstimate: {
    type: Number,
    default: 0,
  },
  costCurrency: {
    type: String,
    default: 'USD',
  },
  locationName: {
    type: String,
  },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number },
  },
  alternatives: [
    {
      title: String,
      description: String,
    }
  ],
});

const daySchema = mongoose.Schema({
  dayNumber: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
  },
  activities: [activitySchema],
});

const tripSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    travelers: {
      type: Number,
      default: 1,
    },
    budget: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    travelStyle: {
      type: String,
      default: 'adventure',
    },
    itinerary: [daySchema],
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;
