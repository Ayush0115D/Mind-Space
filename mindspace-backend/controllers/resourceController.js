const Resource = require('../models/Resource');

// @desc    Get all resources with filtering and search
// @route   GET /api/resources
// @access  Public
const getResources = async (req, res) => {
  try {
    const { category, search } = req.query;

    console.log('📚 GET /api/resources called');
    console.log('Query params:', { category, search });

    // Build filter object
    let filter = { isActive: true };

    // Category filter (matches your frontend categories)
    if (category && category !== 'all') {
      filter.category = category;
      console.log('Filtering by category:', category);
    }

    // Search functionality - searches in title, description, and tags
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

    // Get resources from database
    const resources = await Resource.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    console.log(`Found ${resources.length} resources`);

    const response = {
      success: true,
      count: resources.length,
      data: resources
    };

    console.log('Sending response:', { success: response.success, count: response.count });
    res.json(response);

  } catch (error) {
    console.error('❌ Get resources error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching resources',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get crisis support data (static data matching your frontend)
// @route   GET /api/resources/crisis-support
// @access  Public
const getCrisisSupport = async (req, res) => {
  try {
    console.log('Get crisis support request');

    // Static data that matches your CrisisSupport component exactly
    const crisisSupports = [
      { 
        name: "Tele-MANAS", 
        contact: "14416 or 1800-891-4416", 
        available: "24/7" 
      },
      { 
        name: "National Suicide Prevention", 
        contact: "call or text 988", 
        available: "24/7" 
      },
      { 
        name: "Emergency Helpline", 
        contact: "112", 
        available: "24/7" 
      }
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
      message: 'Server error while fetching crisis support',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get therapy platforms data (static data matching your frontend)
// @route   GET /api/resources/therapy-platforms
// @access  Public
const getTherapyPlatforms = async (req, res) => {
  try {
    console.log('Get therapy platforms request');

    // Static data that matches your ResourceSidebar component exactly
    const therapyPlatforms = [
      { 
        name: "BetterHelp", 
        description: "Professional therapy online", 
        rating: 4.5, 
        users: "2M+" 
      },
      { 
        name: "Talkspace", 
        description: "Text & video therapy", 
        rating: 4.3, 
        users: "1M+" 
      },
      { 
        name: "Psychology Today", 
        description: "Find local therapists", 
        rating: 4.7, 
        users: "500K+" 
      }
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
      message: 'Server error while fetching therapy platforms',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single resource by ID
// @route   GET /api/resources/:id
// @access  Public
const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Get resource by ID:', id);

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
      message: 'Server error while fetching resource',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
    console.log('Request body:', req.body);

    // Validate required fields
    if (!title || !description || !type || !category || !duration || !url) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, description, type, category, duration, url'
      });
    }

    // Create new resource
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

module.exports = {
  getResources,
  getCrisisSupport,
  getTherapyPlatforms,
  getResourceById,
  createResource
};