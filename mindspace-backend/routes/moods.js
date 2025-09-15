const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');
const auth = require('../middleware/auth');
// Apply auth to all routes
router.use(auth);

// Routes
router.get('/', moodController.getMoods);
router.post('/', moodController.createMood);
router.put('/:id', moodController.updateMood);
router.delete('/:id', moodController.deleteMood);
router.get('/stats', moodController.getStats);

module.exports = router;