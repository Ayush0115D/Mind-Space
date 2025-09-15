const Mood = require('../models/Mood');

const moodController = {
  // Get all moods for user
getMoods: async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.userId })
      .sort({ date: -1, createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: moods
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch moods',
      error: error.message
    });
  }
},
  // Create new mood
  createMood: async (req, res) => {
    try {
      const { mood, note, date } = req.body;

      // Validate
      if (!mood || mood < 1 || mood > 5) {
        return res.status(400).json({
          success: false,
          message: 'Mood must be between 1 and 5'
        });
      }

      if (!date) {
        return res.status(400).json({
          success: false,
          message: 'Date is required'
        });
      }

      // Check if mood already exists for this date
      const existing = await Mood.findOne({ userId: req.userId, date });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Mood entry already exists for this date'
        });
      }

      // Create timestamp
      const timestamp = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });

      const newMood = new Mood({
        userId: req.userId,
        mood: parseInt(mood),
        note: note || '',
        date,
        timestamp
      });

      await newMood.save();

      res.status(201).json({
        success: true,
        message: 'Mood logged successfully',
        data: newMood
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create mood',
        error: error.message
      });
    }
  },

  // Update mood
  updateMood: async (req, res) => {
    try {
      const { id } = req.params;
      const { mood, note } = req.body;

      const updatedMood = await Mood.findOneAndUpdate(
        { _id: id, userId: req.userId },
        { mood, note },
        { new: true }
      );

      if (!updatedMood) {
        return res.status(404).json({
          success: false,
          message: 'Mood not found'
        });
      }

      res.json({
        success: true,
        data: updatedMood
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update mood',
        error: error.message
      });
    }
  },

  // Delete mood
  deleteMood: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedMood = await Mood.findOneAndDelete({ 
        _id: id, 
        userId: req.user.id 
      });

      if (!deletedMood) {
        return res.status(404).json({
          success: false,
          message: 'Mood not found'
        });
      }

      res.json({
        success: true,
        message: 'Mood deleted successfully'
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete mood',
        error: error.message
      });
    }
  },

  // Get mood stats
  getStats: async (req, res) => {
    try {
      const moods = await Mood.find({ userId: req.userId });

      if (moods.length === 0) {
        return res.json({
          success: true,
          data: {
            totalEntries: 0,
            averageMood: 0,
            trend: 'stable'
          }
        });
      }

      // Calculate stats
      const totalEntries = moods.length;
      const averageMood = (moods.reduce((sum, m) => sum + m.mood, 0) / totalEntries).toFixed(1);
      
      // Simple trend calculation
      let trend = 'stable';
      if (moods.length >= 4) {
        const recent = moods.slice(0, 2);
        const older = moods.slice(2, 4);
        const recentAvg = recent.reduce((sum, m) => sum + m.mood, 0) / recent.length;
        const olderAvg = older.reduce((sum, m) => sum + m.mood, 0) / older.length;
        
        if (recentAvg > olderAvg + 0.5) trend = 'improving';
        else if (recentAvg < olderAvg - 0.5) trend = 'declining';
      }

      res.json({
        success: true,
        data: {
          totalEntries,
          averageMood: parseFloat(averageMood),
          trend
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get stats',
        error: error.message
      });
    }
  }
};

module.exports = moodController;