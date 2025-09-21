const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const auth = require('../middleware/auth'); // Your existing auth middleware

// All routes require authentication
router.use(auth);

// GET /api/goals - Get all goals
router.get('/', goalController.getAllGoals);

// POST /api/goals - Create new goal
router.post('/', goalController.createGoal);

// PUT /api/goals/:id - Update goal
router.put('/:id', goalController.updateGoal);

// POST /api/goals/:id/toggle - Toggle goal completion
router.post('/:id/toggle', goalController.toggleGoal);

// DELETE /api/goals/:id - Delete goal
router.delete('/:id', goalController.deleteGoal);

// GET /api/goals/stats - Get goal statistics
router.get('/stats', goalController.getGoalStats);

module.exports = router;
