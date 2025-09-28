const express = require('express');
const router = express.Router();
const {
  getResources,
  getCrisisSupport,
  getTherapyPlatforms
} = require('../controllers/resourceController');

// @route   GET /api/resources
// @desc    Get all resources with optional filtering by category and search
// @access  Public
router.get('/', getResources);

// @route   GET /api/resources/crisis-support
// @desc    Get crisis support contact information
// @access  Public
router.get('/crisis-support', getCrisisSupport);

// @route   GET /api/resources/therapy-platforms
// @desc    Get therapy platform information
// @access  Public
router.get('/therapy-platforms', getTherapyPlatforms);

module.exports = router;