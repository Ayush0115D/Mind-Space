const Mindmap = require('./models/Mindmap');

const getMindmaps = async (req, res) => {
  try {
    const mindmaps = await Mindmap.find({ user: req.userId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    res.json(mindmaps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMindmap = async (req, res) => {
  try {
    const { title, description, data, isPublic } = req.body;
    
    const mindmap = new Mindmap({
      title,
      description,
      data,
      isPublic,
      user: req.userId
    });
    
    await mindmap.save();
    res.status(201).json(mindmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMindmap = async (req, res) => {
  try {
    const { id } = req.params;
    const mindmap = await Mindmap.findOneAndUpdate(
      { _id: id, user: req.userId },
      req.body,
      { new: true }
    );
    
    if (!mindmap) {
      return res.status(404).json({ message: 'Mindmap not found' });
    }
    
    res.json(mindmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMindmap = async (req, res) => {
  try {
    const { id } = req.params;
    const mindmap = await Mindmap.findOneAndDelete({ _id: id, user: req.userId });
    
    if (!mindmap) {
      return res.status(404).json({ message: 'Mindmap not found' });
    }
    
    res.json({ message: 'Mindmap deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMindmaps,
  createMindmap,
  updateMindmap,
  deleteMindmap
};