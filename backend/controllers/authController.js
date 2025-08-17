import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    
    // Check if user exists
    const user = await User.findOne({ email })
    
    // Validate user and password
    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      })
    } else {
      res.status(401)
      throw new Error('Invalid email or password')
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || 'Invalid email or password'
    })
  }
}

// @desc    Register first admin user
// @route   POST /api/auth/register-first-admin
// @access  Public
export const registerFirstAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      })
    }

    // Check if any admin user already exists
    const adminExists = await User.findOne({ isAdmin: true })
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Admin user already exists'
      })
    }
    
    // Check if user exists with this email
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      })
    }
    
    // Create admin user
    const user = await User.create({
      name,
      email,
      password,
      isAdmin: true
    })
    
    if (user) {
      return res.status(201).json({
        success: true,
        message: 'Admin account created successfully',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id)
        }
      })
    }

  } catch (error) {
    console.error('Admin registration error:', error)
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to create admin account'
    })
  }
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Private/Admin
export const registerUser = async (req, res) => {
  const { name, email, password, isAdmin } = req.body
  
  // Check if user already exists
  const userExists = await User.findOne({ email })
  
  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }
  
  // Create new user
  const user = await User.create({
    name,
    email,
    password,
    isAdmin: isAdmin || false
  })
  
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
}

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (user) {
      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        }
      })
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'User not found'
    })
  }
}