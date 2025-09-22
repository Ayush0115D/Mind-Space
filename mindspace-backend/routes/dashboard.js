const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

const Mood = require('../models/mood');
const Goal = require('../models/Goal');

router.get('/', auth, async (req, res) => {
  try {
    const userId = req.userId;

    // ---------- Recent moods ----------
    const recentLimit = parseInt(req.query.recentLimit) || 4;
    const recentMoodsRaw = await Mood.find({ userId })
      .sort({ date: -1 })
      .limit(recentLimit)
      .select('date mood note -_id');

    const recentMoods = recentMoodsRaw.map(m => ({
      date: m.date,
      mood: m.mood,
      note: m.note || ''
    }));

    // ---------- Mood chart data ----------
    const chartDays = parseInt(req.query.chartDays) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - chartDays);

    const chartDataRaw = await Mood.find({ userId })
      .sort({ date: 1 })
      .select('date mood -_id');

    const chartData = chartDataRaw
      .filter(m => new Date(m.date) >= startDate)
      .map(m => ({
        date: m.date,
        mood: m.mood
      }));

    // ---------- Statistics ----------
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const moodsLast7Days = await Mood.find({ userId });
    const filteredMoods7Days = moodsLast7Days.filter(m => new Date(m.date) >= sevenDaysAgo);

    const averageMood = filteredMoods7Days.length > 0
      ? Math.round(
          filteredMoods7Days.reduce((sum, m) => sum + m.mood, 0) / filteredMoods7Days.length * 10
        ) / 10
      : 0;

    const activeGoalsCount = await Goal.countDocuments({
      userId,
      completed: false  // Only active goals
    });

    const weeklyAverage = averageMood; // same logic as stats

    // ---------- Final response ----------
    res.json({
      recent: recentMoods,
      chart: chartData,
      statistics: {
        averageMood,
        goalsCount: activeGoalsCount,
        period: 'Last 7 days'
      },
      weekly: { weeklyAverage }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data', error: error.message });
  }
});

module.exports = router;
