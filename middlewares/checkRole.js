const checkRole = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.user.role; // Take role from verified token
    if (userRole !== requiredRole) {
      return res
        .status(403)
        .json({ error: 'Access denied, insufficient permissions' });
    }
    next();
  };
};

export default checkRole;
