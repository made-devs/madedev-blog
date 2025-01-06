import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];

  // Check if token provided
  if (!token) {
    return res.status(403).json({ error: 'Access denied, no token provided' });
  }

  try {
    // Extract the token value (remove 'Bearer ' prefix)
    const tokenValue = token.split(' ')[1];

    // Verify token validity
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);

    // Attach user data to request object for further use
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token, please log in again' });
  }
};

export default authMiddleware;
