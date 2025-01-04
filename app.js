// app.js - Express app configuration
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
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

// Register Route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exist
    const userExists = await User.findOne({ username });
    if (userExists)
      return res.status(400).json({ error: 'Username already taken' });

    // Create a new user
    const newUser = new User({ username, password });

    // Save the user to the database
    await newUser.save();

    // Send a success message
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user', details: error });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ error: 'Invalid username or password' });

    // Compare the entered password with the stored hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ error: 'Invalid username or password' });

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Send the token as a response
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in', details: error });
  }
});

// Route to create new post
app.post('/posts', async (req, res) => {
  const token = req.headers['authorization'];

  if (!token)
    return res.status(403).json({ error: 'Access denied, no token provided' });

  // Remove 'Bearer ' prefix (if it exists) to get the token
  const tokenValue = token.split(' ')[1];

  try {
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);

    const { title, content, author } = req.body; // Extract data from the request body

    // Check  if all fields are provided
    if (!title || !content || !author) {
      return res.status(400).json({ error: 'All fields are required' });
    }

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
