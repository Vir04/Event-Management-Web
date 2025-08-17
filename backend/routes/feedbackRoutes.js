import express from 'express'
import { 
  createFeedback, 
  getFeedbacks, 
  getFeaturedFeedbacks,
  getFeedbackById, 
  updateFeedback, 
  updateFeedbackFeatured,
  deleteFeedback 
} from '../controllers/feedbackController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

// @route   POST /api/feedbacks
// @desc    Create a new feedback
// @access  Public
router.post('/', createFeedback)

// @route   GET /api/feedbacks
// @desc    Get all feedbacks
// @access  Public
router.get('/', getFeedbacks)

// @route   GET /api/feedbacks/featured
// @desc    Get featured feedbacks
// @access  Public
router.get('/featured', getFeaturedFeedbacks)

// @route   GET /api/feedbacks/:id
// @desc    Get feedback by ID
// @access  Private/Admin
router.get('/:id', protect, admin, getFeedbackById)

// @route   PUT /api/feedbacks/:id
// @desc    Update feedback
// @access  Private/Admin
router.put('/:id', protect, admin, updateFeedback)

// @route   PUT /api/feedbacks/:id/featured
// @desc    Update feedback featured status
// @access  Private/Admin
router.put('/:id/featured', protect, admin, updateFeedbackFeatured)

// @route   DELETE /api/feedbacks/:id
// @desc    Delete feedback
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteFeedback)

export default router