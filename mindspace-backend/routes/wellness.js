const express = require('express');
const router = express.Router();
const { wellnessChat } = require('../controllers/wellnessController');

// POST /api/wellness/chat
router.post('/', wellnessChat);

// GET /api/wellness/ (test endpoint)
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Wellness chat endpoint is live' });
});

module.exports = router;
