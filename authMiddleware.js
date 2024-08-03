// authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('./models/userModal');

const authenticateUser = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided, authorization denied' });
    }
  
    const token = authHeader.replace('Bearer ', '');
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token, authorization denied' });
    }
  };
  
  const authenticateAdmin = async (req, res, next) => {
    const authHeader = req.header('Authorization');
  
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided, authorization denied' });
    }
  
    const token = authHeader.replace('Bearer ', '');
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
  
      // Check if the user is an admin
      const user = await User.findById(req.user.id);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied, admin only' });
      }
  
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token, authorization denied' });
    }
  };
  
  module.exports = {
    authenticateUser,
    authenticateAdmin,
  };