// app.js - Express app configuration
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import Post from './models/Post.js';
dotenv.config();

// Initialize the app
const app = express();

// Middleware setup
app.use(cors()); // Enable cross-origin requests
app.use(bodyParser.json()); // Parse incoming JSON data

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB Error', err));

// Basic test route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Route to create new post
app.post('/posts', async (req, res) => {
  const { title, content, author } = req.body; // Extract data from the request body

  // Check  if all fields are provided
  if (!title || !content || !author) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Create a new post instance with the data
    const newPost = new Post({ title, content, author });

    // Save the post to MongoDB
    await newPost.save();

    // Send the created post as a response
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posts', details: error });
  }
});

// Route to get all posts
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posts', details: error });
  }
});

export default app;
