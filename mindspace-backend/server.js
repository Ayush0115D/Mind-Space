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

// ✅ Define allowed origins
const allowedOrigins = [
  "https://mind-space-web.vercel.app",  // Production
  "http://localhost:5173",  // Local development (Vite)
  "http://localhost:3000"   // Local development (CRA)
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
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // explicitly allow OPTIONS
}));

// ✅ Handle preflight (OPTIONS) requests globally
app.options('*', cors());

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
