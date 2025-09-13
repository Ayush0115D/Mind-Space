const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/database');

// Import routes
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const mindmapRoutes = require('./src/routes/mindmaps');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mindmaps', mindmapRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Mind-Space Backend API' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});