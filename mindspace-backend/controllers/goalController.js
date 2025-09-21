const Goal = require('../models/Goal');

const goalController = {
  // GET /api/goals - Get all goals for user
  getAllGoals: async (req, res) => {
    try {
      const goals = await Goal.find({ 
        userId: req.user.id, 
        isActive: true 
      }).sort({ createdAt: -1 });
      
      res.json(goals);
    } catch (error) {
      console.error('Error fetching goals:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // POST /api/goals - Create new goal
  createGoal: async (req, res) => {
    try {
      const { title, category, icon, color, target } = req.body;

      if (!title || !category || !target) {
        return res.status(400).json({ 
          message: 'Title, category, and target are required' 
        });
      }

      const goal = new Goal({
        userId: req.user.id,
        title,
        category,
        icon: icon || 'target',
        color: color || 'blue',
        target
      });

      await goal.save();
      res.status(201).json(goal);
    } catch (error) {
      console.error('Error creating goal:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // PUT /api/goals/:id - Update goal
  updateGoal: async (req, res) => {
    try {
      const goal = await Goal.findOne({ 
        _id: req.params.id, 
        userId: req.user.id 
      });

      if (!goal) {
        return res.status(404).json({ message: 'Goal not found' });
      }

      Object.assign(goal, req.body);
      await goal.save();
      res.json(goal);
    } catch (error) {
      console.error('Error updating goal:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // POST /api/goals/:id/toggle - Toggle goal completion
  toggleGoal: async (req, res) => {
    try {
      const goal = await Goal.findOne({ 
        _id: req.params.id, 
        userId: req.user.id 
      });

      if (!goal) {
        return res.status(404).json({ message: 'Goal not found' });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (!goal.completed) {
        // Mark as completed
        goal.completed = true;
        goal.streak += 1;
        goal.lastCompleted = new Date();
        goal.completionHistory.push({ date: new Date(), completed: true });
      } else {
        // Unmark completion
        goal.completed = false;
        goal.streak = Math.max(0, goal.streak - 1);
        goal.completionHistory = goal.completionHistory.filter(
          h => h.date.toDateString() !== today.toDateString()
        );
      }

      await goal.save();
      res.json(goal);
    } catch (error) {
      console.error('Error toggling goal:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // DELETE /api/goals/:id - Delete goal
  deleteGoal: async (req, res) => {
    try {
      const goal = await Goal.findOne({ 
        _id: req.params.id, 
        userId: req.user.id 
      });

      if (!goal) {
        return res.status(404).json({ message: 'Goal not found' });
      }

      goal.isActive = false;
      await goal.save();
      res.json({ message: 'Goal deleted successfully' });
    } catch (error) {
      console.error('Error deleting goal:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // GET /api/goals/stats - Get goal statistics
  getGoalStats: async (req, res) => {
    try {
      const goals = await Goal.find({ 
        userId: req.user.id, 
        isActive: true 
      });

      const stats = {
        totalGoals: goals.length,
        completedToday: goals.filter(g => g.completed).length,
        longestStreak: Math.max(...goals.map(g => g.streak), 0),
        goalsAchieved: goals.filter(g => g.streak >= g.target).length,
        overallProgress: goals.length > 0 
          ? Math.round(goals.reduce((acc, g) => acc + Math.min((g.streak / g.target) * 100, 100), 0) / goals.length)
          : 0
      };

      res.json(stats);
    } catch (error) {
      console.error('Error fetching goal stats:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = goalController;
