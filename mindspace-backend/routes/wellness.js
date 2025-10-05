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
// Add this to your routes/wellness.js temporarily
router.get('/test-models', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});