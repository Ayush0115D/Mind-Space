const dotenv = require('dotenv');
dotenv.config(); // ✅ MUST be first before any other require that uses env vars

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const mindmapRoutes = require('./routes/mindmaps');
const moodRoutes = require('./routes/moods');
const goalRoutes = require('./routes/goals');
const dashboardRoutes = require('./routes/dashboard');
const resourceRoutes = require('./routes/resources');
const wellnessRoutes = require('./routes/wellness');
const reminderRoutes = require('./routes/reminders'); // ✨ NEW
const communityRoutes = require('./routes/community');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// CORS configuration
const allowedOrigins = [
  "https://mind-space-web.vercel.app",
  "http://localhost:5173"
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mindmaps', mindmapRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/wellness', wellnessRoutes);
app.use('/api/reminders', reminderRoutes); // 
app.use('/api/community', communityRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Mind-Space Backend API' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📚 Resources endpoint: http://localhost:${PORT}/api/resources`);
  console.log(`🧠 Wellness endpoint: http://localhost:${PORT}/api/wellness`);
  console.log(`📧 Reminders endpoint: http://localhost:${PORT}/api/reminders`);
});