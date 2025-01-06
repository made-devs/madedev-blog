// app.js - Express app configuration
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
dotenv.config();

// Initialize the app
const app = express();

// Middleware setup
app.use(cors()); // Enable cross-origin requests
app.use(express.json()); // Parse incoming JSON data

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB Error', err));

// Use Routes
app.use('/', userRoutes);
app.use('/', postRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

export default app;
