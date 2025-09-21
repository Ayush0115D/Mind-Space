const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Routes
const authRoutes = require('./routes/auth');
const mindmapRoutes = require('./routes/mindmaps');
const moodRoutes = require('./routes/moods');
const goalRoutes = require('./routes/goals');
const dashboardRoutes = require('./routes/dashboard'); // ADD THIS LINE

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// ✅ Define allowed origins
const allowedOrigins = [
  "https://mind-space-web.vercel.app",  // Production
  "http://localhost:5173",              // Local development (Vite)
  "http://localhost:3000"               // Local development (CRA)
].filter(Boolean);

// ✅ CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman) or from allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"], // explicitly allow methods
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mindmaps', mindmapRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/dashboard', dashboardRoutes); // ADD THIS LINE

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Mind-Space Backend API' });
});

// Add this for debugging
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});