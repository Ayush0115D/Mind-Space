const Resource = require('../models/Resource');

// @desc    Get all resources with filtering and search
// @route   GET /api/resources
// @access  Public
const getResources = async (req, res) => {
  try {
    const { category, search } = req.query;

    console.log('📚 GET /api/resources called');
    console.log('Query params:', { category, search });

    let filter = { isActive: true };

    if (category && category !== 'all') {
      filter.category = category;
      console.log('Filtering by category:', category);
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: { $in: [searchRegex] } }
      ];
      console.log('Search filter applied:', search);
    }

    console.log('MongoDB filter:', filter);

    const resources = await Resource.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    console.log(`Found ${resources.length} resources`);

    res.json({
      success: true,
      count: resources.length,
      data: resources
    });

  } catch (error) {
    console.error('❌ Get resources error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching resources',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get crisis support data
// @route   GET /api/resources/crisis-support
// @access  Public
const getCrisisSupport = async (req, res) => {
  try {
    const crisisSupports = [
      { name: "Tele-MANAS", contact: "14416 or 1800-891-4416", available: "24/7" },
      { name: "National Suicide Prevention", contact: "call or text 988", available: "24/7" },
      { name: "Emergency Helpline", contact: "112", available: "24/7" }
    ];

    res.json({
      success: true,
      count: crisisSupports.length,
      data: crisisSupports
    });

  } catch (error) {
    console.error('Get crisis support error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching crisis support'
    });
  }
};

// @desc    Get therapy platforms data
// @route   GET /api/resources/therapy-platforms
// @access  Public
const getTherapyPlatforms = async (req, res) => {
  try {
    const therapyPlatforms = [
      { name: "BetterHelp", description: "Professional therapy online", rating: 4.5, users: "2M+" },
      { name: "Talkspace", description: "Text & video therapy", rating: 4.3, users: "1M+" },
      { name: "Psychology Today", description: "Find local therapists", rating: 4.7, users: "500K+" }
    ];

    res.json({
      success: true,
      count: therapyPlatforms.length,
      data: therapyPlatforms
    });

  } catch (error) {
    console.error('Get therapy platforms error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching therapy platforms'
    });
  }
};

// @desc    Get single resource by ID
// @route   GET /api/resources/:id
// @access  Public
const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findById(id).lean();

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    res.json({
      success: true,
      data: resource
    });

  } catch (error) {
    console.error('Get resource by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching resource'
    });
  }
};

// @desc    Create new resource
// @route   POST /api/resources
// @access  Public
const createResource = async (req, res) => {
  try {
    const { title, description, type, category, duration, rating, tags, url } = req.body;

    console.log('📝 POST /api/resources called');

    if (!title || !description || !type || !category || !duration || !url) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, description, type, category, duration, url'
      });
    }

    const newResource = await Resource.create({
      title,
      description,
      type,
      category,
      duration,
      rating: rating || 4.0,
      tags: Array.isArray(tags) ? tags : [],
      url
    });

    console.log('✅ Resource created:', newResource._id);

    res.status(201).json({
      success: true,
      data: newResource
    });

  } catch (error) {
    console.error('❌ Create resource error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating resource'
    });
  }
};

// @desc    Seed database with initial resources
// @route   GET /api/resources/seed
// @access  Public (REMOVE AFTER SEEDING!)
const seedDatabase = async (req, res) => {
  try {
    console.log('🌱 Seeding database...');

    const seedData = [
      {
        title: "Understanding Burnout: Signs and Solutions",
        type: "article",
        category: "burnout",
        duration: "8 min read",
        rating: 4.8,
        description: "Learn to recognize early signs of burnout and discover effective recovery strategies that actually work.",
        tags: ["workplace", "stress", "recovery"],
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        isActive: true
      },
      {
        title: "Meditation for Anxiety Relief",
        type: "video",
        category: "anxiety",
        duration: "15 min",
        rating: 4.9,
        description: "Guided meditation techniques specifically designed to calm anxious thoughts and restore inner peace.",
        tags: ["mindfulness", "breathing", "calm"],
        url: "https://www.youtube.com/watch?v=ZToicYcHIOU",
        isActive: true
      },
      {
        title: "Building Meaningful Connections",
        type: "podcast",
        category: "loneliness",
        duration: "32 min",
        rating: 4.7,
        description: "Expert insights on overcoming loneliness and building lasting relationships in our digital age.",
        tags: ["social", "community", "friendship"],
        url: "https://www.youtube.com/watch?v=8CrOL-ydFMI",
        isActive: true
      },
      {
        title: "Daily Motivation Practices",
        type: "article",
        category: "motivation",
        duration: "6 min read",
        rating: 4.6,
        description: "Simple yet powerful practices to maintain motivation and momentum in your personal growth journey.",
        tags: ["habits", "goals", "productivity"],
        url: "https://www.mindtools.com/pages/article/motivation-techniques.htm",
        isActive: true
      },
      {
        title: "The Science of Emotional Resilience",
        type: "video",
        category: "motivation",
        duration: "22 min",
        rating: 4.9,
        description: "Research-backed strategies for building mental strength and resilience in challenging times.",
        tags: ["psychology", "resilience", "growth"],
        url: "https://www.youtube.com/watch?v=NWH8N-BvhAw",
        isActive: true
      },
      {
        title: "Mindful Communication in Relationships",
        type: "podcast",
        category: "relationships",
        duration: "28 min",
        rating: 4.8,
        description: "Transform your relationships through mindful listening and empathetic communication techniques.",
        tags: ["communication", "empathy", "mindfulness"],
        url: "https://www.youtube.com/watch?v=eyq2Wo4eUDg",
        isActive: true
      }
    ];

    await Resource.deleteMany({});
    const created = await Resource.insertMany(seedData);

    console.log(`✅ Seeded ${created.length} resources`);

    res.json({
      success: true,
      message: `Successfully seeded ${created.length} resources`,
      count: created.length,
      data: created
    });

  } catch (error) {
    console.error('❌ Seed error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update resource
// @route   PUT /api/resources/:id
// @access  Public
const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, category, duration, rating, tags, url } = req.body;

    console.log('📝 PUT /api/resources/:id called', id);

    const updatedResource = await Resource.findByIdAndUpdate(
      id,
      {
        title,
        description,
        type,
        category,
        duration,
        rating: parseFloat(rating),
        tags: Array.isArray(tags) ? tags : [],
        url
      },
      { new: true, runValidators: true }
    );

    if (!updatedResource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    console.log('✅ Resource updated:', updatedResource._id);

    res.json({
      success: true,
      data: updatedResource
    });

  } catch (error) {
    console.error('❌ Update resource error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating resource'
    });
  }
};

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Public
const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ DELETE /api/resources/:id called', id);

    const deletedResource = await Resource.findByIdAndDelete(id);

    if (!deletedResource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    console.log('✅ Resource deleted:', id);

    res.json({
      success: true,
      message: 'Resource deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete resource error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting resource'
    });
  }
};

module.exports = {
  getResources,
  getCrisisSupport,
  getTherapyPlatforms,
  getResourceById,
  createResource,
  seedDatabase,
  updateResource,
  deleteResource
};