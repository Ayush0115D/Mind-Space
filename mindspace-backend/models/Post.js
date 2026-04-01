const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, trim: true, maxlength: 500 },
  anonName: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  anonName: { type: String, default: '' }, // e.g. "Gentle Panda"
  content: { type: String, required: true, trim: true, maxlength: 1000 },
  topic: {
    type: String,
    required: true,
    enum: ['general', 'stress', 'depression', 'motivation', 'sleep', 'relationships', 'good-vibes', 'wins'],
    default: 'general'
  },
  reactions: {
    heart:   { type: Number, default: 0 },
    hug:     { type: Number, default: 0 },
    strong:  { type: Number, default: 0 },
  },
  // Track who reacted to prevent duplicates
  reactedBy: [{
    userId: mongoose.Schema.Types.ObjectId,
    reaction: { type: String, enum: ['heart', 'hug', 'strong'] }
  }],
  replies: [replySchema],
  isVisible: { type: Boolean, default: true }, // for moderation
}, { timestamps: true });

postSchema.index({ topic: 1, createdAt: -1 });
postSchema.index({ userId: 1 });

module.exports = mongoose.model('Post', postSchema);