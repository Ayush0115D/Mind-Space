const User = require('../models/User');

// Get current user's profile
const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.json({
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      createdAt: req.user.createdAt
    });
  } catch (error) {
    console.error('getProfile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update current user's profile
const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { username } = req.body;

    if (!username || username.trim() === '') {
      return res.status(400).json({ message: 'Username is required' });
    }

    // Check if username is already taken by another user
    const existingUser = await User.findOne({ username, _id: { $ne: req.user._id } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id, // use req.user._id consistently
      { username },
      { new: true, runValidators: true }
    );

    res.json({
      id: user._id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile
};
