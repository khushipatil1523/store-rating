import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js'; 
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import storeOwnerRoutes from './routes/storeOwnerRoutes.js';
dotenv.config();

const app = express();

// CORS Configuration
app.use(cors({
  origin: "*", // Your frontend URL
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); // Changed from '/admin' to '/api/admin'
app.use('/api/user', userRoutes);
app.use('/api/store-owner', storeOwnerRoutes);
// Test route
app.get('/', (req, res) => {
  res.send('Backend Server is Running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Internal Server Error' 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});