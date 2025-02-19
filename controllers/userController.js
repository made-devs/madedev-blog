import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    // Compare the entered password with the stored hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    try {
      // Create a JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
        }
      );

      // Send token as HttpOnly cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000,
      });
    } catch (error) {
      console.error('JWT error:', error.message);
      res.status(500).json({ error: 'Error generating token' });
    }

    // Send the token as a response
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: 'Invalid username or password' });
  }
};

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

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
    res.status(201).json({
      message: 'User registered successfully',
      user: { username: newUser.username },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user', details: error });
  }
};
