import Post from '../models/Post.js';

export const createPost = async (req, res) => {
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
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posts', details: error });
  }
};
