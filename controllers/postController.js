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
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10 || 1);
    const limitNumber = parseInt(limit, 10 || 10);

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

export const updatePost = async (req, res) => {
  const { id } = req.params; // Take ID from URL
  const { title, content, author } = req.body; // Take data from req.body

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content, author },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: 'Error updating post', details: error });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params; // Take ID from URL

  try {
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.send(404).json({ error: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting post', details: error });
  }
};

export const addComment = async (req, res) => {
  const { id } = req.params; // Take ID from URL
  const { content } = req.body; // Take comment from body req
  const user = req.user.userId; // Take user ID from token

  try {
    // FInd post based ID
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const newComment = {
      user, // User ID from JWT token
      content, // comment
      createdAt: new Date(), // Time created
    };

    post.comments.push(newComment);

    await post.save();

    res.status(201).json({ message: 'Comment added successfully', post });
  } catch (error) {
    res.status(500).json({ error: 'Error adding comment', details: error });
  }
};
