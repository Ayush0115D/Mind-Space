const express = require('express');
const router = express.Router();
const wellnessController = require('../controllers/wellnessController');

router.get('/health', wellnessController.healthCheck);
router.post('/mood-advice', wellnessController.getMoodAdvice);
router.post('/wellness-chat', wellnessController.wellnessChat);

module.exports = router;