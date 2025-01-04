import mongoose from 'mongoose';

// Define the schema for blog post
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create a model from the schema and export it
const Post = mongoose.model('Post', postSchema);

export default Post;
