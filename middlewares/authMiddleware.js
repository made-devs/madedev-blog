import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  // Check if token provided
  if (!token) {
    return res.status(403).json({ error: 'Unauthiorized access' });
  }

  try {
    // Verify token validity
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to request object for further use
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized access' });
  }
};

export default authMiddleware;
