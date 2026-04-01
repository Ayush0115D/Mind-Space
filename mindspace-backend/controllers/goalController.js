const Goal = require('../models/Goal');

const goalController = {
  // GET /api/goals - Get all active goals
  getAllGoals: async (req, res) => {
    try {
      const goals = await Goal.find({ userId: req.user.id, isActive: true }).sort({ createdAt: -1 });
      res.json({ success: true, data: goals });
    } catch (error) {
      console.error('Error fetching goals:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  // POST /api/goals - Create new goal
  createGoal: async (req, res) => {
    try {
      const { title, category, icon, color, target } = req.body;

      if (!title || !category || !target) {
        return res.status(400).json({ success: false, message: 'Title, category, and target are required' });
      }

      const goal = new Goal({
        userId: req.user.id,
        title,
        category,
        icon: icon || 'target',
        color: color || 'blue',
        target,
        streak: 0,
        completionHistory: [],
        isActive: true
      });

      await goal.save();
      res.status(201).json({ success: true, data: goal });
    } catch (error) {
      console.error('Error creating goal:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  // PUT /api/goals/:id - Update goal (excluding streak/completion)
  updateGoal: async (req, res) => {
    try {
      const goal = await Goal.findOne({ _id: req.params.id, userId: req.user.id });
      if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });

      const { title, category, icon, color, target } = req.body;
      if (title) goal.title = title;
      if (category) goal.category = category;
      if (icon) goal.icon = icon;
      if (color) goal.color = color;
      if (target) goal.target = target;

      await goal.save();
      res.json({ success: true, data: goal });
    } catch (error) {
      console.error('Error updating goal:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  // POST /api/goals/:id/toggle - Toggle daily progress
  toggleGoal: async (req, res) => {
    try {
      const goal = await Goal.findOne({ _id: req.params.id, userId: req.user.id });
      if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const alreadyCompletedToday = goal.completionHistory.some(
        h => new Date(h.date).toDateString() === today.toDateString()
      );

      if (!alreadyCompletedToday) {
        goal.streak += 1;
        goal.lastCompleted = today;
        goal.completionHistory.push({ date: today });
      } else {
        goal.streak = Math.max(0, goal.streak - 1);
        goal.completionHistory = goal.completionHistory.filter(
          h => new Date(h.date).toDateString() !== today.toDateString()
        );
      }

      await goal.save();
      res.json({ success: true, data: goal });
    } catch (error) {
      console.error('Error toggling goal:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  // DELETE /api/goals/:id - Soft delete
  deleteGoal: async (req, res) => {
    try {
      const goal = await Goal.findOne({ _id: req.params.id, userId: req.user.id });
      if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });

      goal.isActive = false;
      await goal.save();
      res.json({ success: true, message: 'Goal deleted successfully' });
    } catch (error) {
      console.error('Error deleting goal:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  // GET /api/goals/stats - Get goal statistics (removed completed goals count)
  getGoalStats: async (req, res) => {
    try {
      const goals = await Goal.find({ userId: req.user.id, isActive: true });

      const stats = {
        totalGoals: goals.length,
        longestStreak: goals.length > 0 ? Math.max(...goals.map(g => g.streak)) : 0,
        overallProgress: goals.length > 0
          ? Math.round(
              goals.reduce((acc, g) => acc + Math.min((g.streak / g.target) * 100, 100), 0) / goals.length
            )
          : 0
      };

      res.json({ success: true, data: stats });
    } catch (error) {
      console.error('Error fetching goal stats:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
};

module.exports = goalController;
