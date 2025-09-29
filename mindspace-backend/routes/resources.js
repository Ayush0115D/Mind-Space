const express = require('express');
const router = express.Router();
const {
  getResources,
  getCrisisSupport,
  getTherapyPlatforms,
  getResourceById,
  createResource,
  seedDatabase
} = require('../controllers/resourceController');

// SEED ROUTE - Visit this URL once to populate database, then remove!
router.get('/seed', seedDatabase);

// Public routes
router.get('/', getResources);
router.post('/', createResource);
router.get('/crisis-support', getCrisisSupport);
router.get('/therapy-platforms', getTherapyPlatforms);
router.get('/:id', getResourceById);

module.exports = router;