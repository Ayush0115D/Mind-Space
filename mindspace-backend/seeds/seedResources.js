const mongoose = require('mongoose');
const Resource = require('../models/Resource');

// Sample resources data that matches your frontend exactly
const resources = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
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

const seedResources = async () => {
  try {
    console.log('🌱 Starting resource seeding...');

    // Clear existing resources
    await Resource.deleteMany({});
    console.log('🧹 Cleared existing resources');

    // Insert seed data
    const createdResources = await Resource.insertMany(resources);
    console.log(`✅ Successfully seeded ${createdResources.length} resources`);

    // Display seeded resources
    console.log('\n📚 Seeded Resources:');
    createdResources.forEach((resource, index) => {
      console.log(`${index + 1}. ${resource.title} (${resource.category})`);
    });

    return createdResources;

  } catch (error) {
    console.error('❌ Error seeding resources:', error);
    throw error;
  }
};

module.exports = seedResources;

// Run seeding if this file is executed directly
if (require.main === module) {
  const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mindspace', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error('❌ Database connection error:', error);
      process.exit(1);
    }
  };
  
  const runSeeding = async () => {
    try {
      await connectDB();
      await seedResources();
      console.log('\n🎉 Resource seeding completed successfully!');
      console.log('You can now start your server and test the API endpoints.');
      process.exit(0);
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    }
  };

  runSeeding();
}