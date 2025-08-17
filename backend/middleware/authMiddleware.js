import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

// Middleware to protect routes
export const protect = async (req, res, next) => {
  let token
  
  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (remove "Bearer ")
      token = req.headers.authorization.split(' ')[1]
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select('-password')
      
      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token invalid')
    }
  }
  
  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
}

// Middleware to check if user is admin
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(403)
    throw new Error('Not authorized as admin')
  }
}