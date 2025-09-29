const express = require('express');
const router = express.Router();
const {
  getResources,
  getCrisisSupport,
  getTherapyPlatforms,
  getResourceById,
  createResource
} = require('../controllers/resourceController');

// @route   GET /api/resources
// @desc    Get all resources with optional filtering by category and search
// @access  Public
router.get('/', getResources);

// @route   POST /api/resources
// @desc    Create new resource
// @access  Public
router.post('/', createResource);

// @route   GET /api/resources/crisis-support
// @desc    Get crisis support contact information
// @access  Public
router.get('/crisis-support', getCrisisSupport);

// @route   GET /api/resources/therapy-platforms
// @desc    Get therapy platform information
// @access  Public
router.get('/therapy-platforms', getTherapyPlatforms);

// @route   GET /api/resources/:id
// @desc    Get single resource by ID
// @access  Public
router.get('/:id', getResourceById);

module.exports = router;