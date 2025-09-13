const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const mindmapRoutes = require('./routes/mindmaps');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// ✅ CORS configuration using environment variable
app.use(cors({
  origin: [
    process.env.FRONTEND_URL, // Your deployed frontend URL from .env
    "http://localhost:5173",  // Keep for local development
    "http://localhost:3000"   // Alternative React port
  ].filter(Boolean), // Remove undefined values
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mindmaps', mindmapRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Mind-Space Backend API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});