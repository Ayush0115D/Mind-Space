const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['mental', 'physical', 'sleep', 'social', 'creative']
  },
  icon: {
    type: String,
    default: 'target'
  },
  color: {
    type: String,
    default: 'blue'
  },
  target: {
    type: Number,
    required: true,
    min: 1,
    max: 365
  },
  streak: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  lastCompleted: Date,
  completionHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    completed: {
      type: Boolean,
      default: true
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
goalSchema.index({ userId: 1, category: 1 });
goalSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model('Goal', goalSchema);
