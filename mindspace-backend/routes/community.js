const express = require('express');
const router = express.Router();

// Temporary in-memory store
let posts = [];

// GET posts
router.get('/', async (req, res) => {
  res.json({
    success: true,
    data: posts,
    pages: 1
  });
});

// CREATE post
router.post('/', async (req, res) => {
  try {
    const { content, topic } = req.body;

    const newPost = {
      _id: Date.now().toString(),
      content,
      topic,
      anonName: 'Anonymous',
      createdAt: new Date(),
      reactions: {},
      replies: []
    };

    posts.unshift(newPost);

    res.json({
      success: true,
      data: newPost
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to create post'
    });
  }
});

// REACT
router.post('/:id/react', (req, res) => {
  const { reaction } = req.body;

  const post = posts.find(p => p._id === req.params.id);
  if (!post) return res.status(404).json({ success: false });

  post.reactions[reaction] = (post.reactions[reaction] || 0) + 1;

  res.json({
    success: true,
    reactions: post.reactions,
    myReaction: reaction
  });
});

// REPLY
router.post('/:id/reply', (req, res) => {
  const { content } = req.body;

  const post = posts.find(p => p._id === req.params.id);
  if (!post) return res.status(404).json({ success: false });

  const reply = {
    anonName: 'Anonymous',
    content,
    createdAt: new Date()
  };

  post.replies.push(reply);

  res.json({
    success: true,
    data: reply
  });
});

// DELETE
router.delete('/:id', (req, res) => {
  posts = posts.filter(p => p._id !== req.params.id);
  res.json({ success: true });
});

module.exports = router;