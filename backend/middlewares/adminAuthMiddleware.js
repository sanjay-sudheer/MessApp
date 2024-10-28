const jwt = require('jsonwebtoken');

const adminAuthMiddleware = (req, res, next) => {
  const token = req.header('Authorization'); // Extract token from the Authorization header

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the decoded token has isAdmin flag
    if (decoded.isAdmin) {
      req.user = decoded; // Attach decoded token to req.user for further use
      next(); // Continue to the next middleware or route
    } else {
      res.status(403).json({ message: 'Access denied: Admins only' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = adminAuthMiddleware;
