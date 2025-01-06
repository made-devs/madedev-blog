import { validationResult } from 'express-validator';
import Post from '../models/Post.js';

export const createPost = async (req, res) => {
  // Catch error validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
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
};

export const allPosts = async (req, res) => {
  try {
    // Add Page and Limit from URL
    const { page = 2, limit = 5 } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Take data from DB
    const posts = await Post.find()
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);
    const totalPosts = await Post.countDocuments();

    res.status(200).json({
      posts,
      pagination: {
        total: totalPosts,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalPosts / limitNumber),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posts', details: error });
  }
};
