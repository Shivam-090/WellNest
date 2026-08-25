import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import checkInRoutes from './routes/checkInRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import journeyRoutes from './routes/journeyRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check / Root endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '🌸 WellNest AI API is running smoothly',
    timestamp: new Date().toISOString(),
    collections: ['User / Profile', 'CheckIn Tests', 'Daily Tasks Progress', 'Journey & Gamification', 'Chat Sessions & Messages']
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/checkins', checkInRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/journey', journeyRoutes);
app.use('/api/chat', chatRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🌸 WellNest AI Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});
