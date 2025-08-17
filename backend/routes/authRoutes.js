import express from 'express'
import { loginUser, registerUser, registerFirstAdmin, getUserProfile } from '../controllers/authController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
router.post('/login', loginUser)

// @route   POST /api/auth/register-first-admin
// @desc    Register the first admin user
// @access  Public
router.post('/register-first-admin', registerFirstAdmin)

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Private/Admin
router.post('/register', protect, admin, registerUser)

// @route   GET /api/auth/me
// @desc    Get user profile
// @access  Private
router.get('/me', protect, getUserProfile)

// @route   GET /api/auth/verify
// @desc    Verify token & get user data
// @access  Private
router.get('/verify', protect, (req, res) => {
  res.json({
    success: true,
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      isAdmin: req.user.isAdmin
    }
  })
})

export default router