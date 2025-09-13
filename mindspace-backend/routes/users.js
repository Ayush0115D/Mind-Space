const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/profile', auth, (req, res) => {
  res.json({
    id: req.user._id,
    username: req.user.username,
    email: req.user.email
  });
});

module.exports = router;