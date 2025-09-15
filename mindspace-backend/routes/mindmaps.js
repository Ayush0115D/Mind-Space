const express = require('express');
const {
  getMindmaps,
  createMindmap,
  updateMindmap,
  deleteMindmap
} = require('../controllers/mindmapController');

const router = express.Router();

router.use(auth); // Protect all mindmap routes

router.get('/', getMindmaps);
router.post('/', createMindmap);
router.put('/:id', updateMindmap);
router.delete('/:id', deleteMindmap);

module.exports = router;