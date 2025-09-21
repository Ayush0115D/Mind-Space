// routes/dashboard.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Your existing auth middleware
const mongoose = require('mongoose');

// Import your existing models - adjust paths if needed
const Mood = require('../models/mood'); // or wherever your mood model is
const Goal = require('../models/Goal'); // or wherever your goal model is

// Get recent mood entries for dashboard
router.get('/recent-moods', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    
    const recentMoods = await Mood.find({ 
      user: new mongoose.Types.ObjectId(req.user.userId) 
    })
      .sort({ date: -1 })
      .limit(limit)
      .select('date mood note -_id');

    // Format dates for frontend
    const formattedMoods = recentMoods.map(mood => ({
      date: mood.date.toISOString().split('T')[0], // YYYY-MM-DD format
      mood: mood.mood,
      note: mood.note || ''
    }));

    res.json(formattedMoods);
  } catch (error) {
    console.error('Error fetching recent moods:', error);
    res.status(500).json({ message: 'Failed to fetch recent moods', error: error.message });
  }
});

// Get mood chart data for dashboard
router.get('/mood-chart', auth, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const chartData = await Mood.find({
      user: new mongoose.Types.ObjectId(req.user.userId),
      date: { $gte: startDate }
    })
    .sort({ date: 1 })
    .select('date mood -_id');

    // Format data for recharts
    const formattedData = chartData.map(mood => ({
      date: mood.date.toISOString().split('T')[0],
      mood: mood.mood
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching mood chart data:', error);
    res.status(500).json({ message: 'Failed to fetch mood chart data', error: error.message });
  }
});

// Get dashboard statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get average mood for last 7 days
    const moodStats = await Mood.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.userId),
          date: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          averageMood: { $avg: '$mood' }
        }
      }
    ]);

    // Get active goals count
    const activeGoalsCount = await Goal.countDocuments({
      user: new mongoose.Types.ObjectId(req.user.userId),
      status: 'active'
    });

    const averageMood = moodStats.length > 0 
      ? Math.round(moodStats[0].averageMood * 10) / 10 
      : null;

    res.json({
      averageMood,
      goalsCount: activeGoalsCount,
      period: 'Last 7 days'
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats', error: error.message });
  }
});

// Get weekly average for recent entries component
router.get('/weekly-average', auth, async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyStats = await Mood.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.userId),
          date: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          averageMood: { $avg: '$mood' }
        }
      }
    ]);

    const weeklyAverage = weeklyStats.length > 0 
      ? Math.round(weeklyStats[0].averageMood * 10) / 10 
      : null;

    res.json({ weeklyAverage });
  } catch (error) {
    console.error('Error fetching weekly average:', error);
    res.status(500).json({ message: 'Failed to fetch weekly average', error: error.message });
  }
});

module.exports = router;