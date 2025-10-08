import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/database.js';
import dotenv from 'dotenv';
dotenv.config();
import User from './models/userModel.js';

import userRoutes from './routes/userRoutes.js';
import boatRepairRoutes from './routes/boatRepairRoutes.js';
import authRoutes from './routes/authRoutes.js';
import boatRideRoutes from './routes/boatRideRoutes.js';
import productRoutes from './routes/productRoutes.js';
import aboutRoutes from './routes/about.route.js';
import boatCatalogRoutes from './routes/boatCatalog.route.js';
import appointmentBookingRoutes from './routes/appointmentBooking.route.js';
import contactFormRoutes from './routes/contactForm.route.js';
import reviewRoutes from './routes/review.route.js';
import analyticsRoutes from './routes/analyticsRoutes.js';



// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware - protects against common vulnerabilities
app.use(helmet());

// CORS middleware - allows frontend to communicate with backend
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true
}));

// Body parsing middleware - allows us to read JSON from requests
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware - logs all HTTP requests for debugging
app.use(morgan('combined'));

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    message: 'Boat Service Management API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Boat Service Management System API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      docs: '/api/docs' // We'll add this later
    }
  });
});

// API routes

// user routes 
app.use('/api/users', userRoutes );

// boat repair routes
app.use('/api/boat-repairs', boatRepairRoutes);

// auth routes (password reset, etc.)
app.use('/api/auth', authRoutes);

// boat ride routes
app.use('/api/boat-rides', boatRideRoutes);

// product routes (spare parts)
app.use('/api/products', productRoutes);

// about page routes
app.use('/api/about', aboutRoutes);

// Phase 1: Customer routes
app.use('/api/boats', boatCatalogRoutes);
app.use('/api/appointments', appointmentBookingRoutes);
app.use('/api/contacts', contactFormRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);


// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Migration function - completed and no longer needed

// Start the server
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();
    
    // Migration completed - no longer needed
    
    // Then start the server
    app.listen(PORT, () => {
      console.log(`🚢 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the application
startServer();

export default app;