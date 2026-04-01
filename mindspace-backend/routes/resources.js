const express = require('express');
const router = express.Router();
const {
  getResources,
  getCrisisSupport,
  getTherapyPlatforms,
  getResourceById,
  createResource,
  seedDatabase,
  updateResource,
  deleteResource
} = require('../controllers/resourceController');

// IMPORTANT: Specific routes MUST come before parameterized routes (:id)
router.get('/seed', seedDatabase);
router.get('/crisis-support', getCrisisSupport);
router.get('/therapy-platforms', getTherapyPlatforms);

// Main resource routes
router.get('/', getResources);
router.post('/', createResource);

// Parameterized routes - these must come LAST
router.route('/:id')
  .get(getResourceById)
  .put(updateResource)
  .delete(deleteResource);

module.exports = router;