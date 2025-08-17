import Feedback from '../models/feedbackModel.js'

// @desc    Create a new feedback
// @route   POST /api/feedbacks
// @access  Public
export const createFeedback = async (req, res) => {
  try {
    const {
      name,
      email,
      eventType,
      eventDate,
      rating,
      message
    } = req.body

    const feedback = await Feedback.create({
      name,
      email,
      eventType,
      eventDate,
      rating,
      message
    })

    res.status(201).json(feedback)
  } catch (error) {
    res.status(400)
    throw new Error(error.message)
  }
}

// @desc    Get all feedbacks
// @route   GET /api/feedbacks
// @access  Public
export const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({}).sort({ createdAt: -1 })
    res.json(feedbacks)
  } catch (error) {
    res.status(500)
    throw new Error('Server error: ' + error.message)
  }
}

// @desc    Get featured feedbacks
// @route   GET /api/feedbacks/featured
// @access  Public
export const getFeaturedFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ featured: true }).sort({ createdAt: -1 }).limit(6)
    res.json(feedbacks)
  } catch (error) {
    res.status(500)
    throw new Error('Server error: ' + error.message)
  }
}

// @desc    Get feedback by ID
// @route   GET /api/feedbacks/:id
// @access  Private/Admin
export const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
    
    if (feedback) {
      res.json(feedback)
    } else {
      res.status(404)
      throw new Error('Feedback not found')
    }
  } catch (error) {
    res.status(500)
    throw new Error('Server error: ' + error.message)
  }
}

// @desc    Update feedback
// @route   PUT /api/feedbacks/:id
// @access  Private/Admin
export const updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
    
    if (feedback) {
      feedback.name = req.body.name || feedback.name
      feedback.email = req.body.email || feedback.email
      feedback.eventType = req.body.eventType || feedback.eventType
      feedback.eventDate = req.body.eventDate || feedback.eventDate
      feedback.rating = req.body.rating || feedback.rating
      feedback.message = req.body.message || feedback.message
      feedback.featured = req.body.featured !== undefined ? req.body.featured : feedback.featured
      
      const updatedFeedback = await feedback.save()
      res.json(updatedFeedback)
    } else {
      res.status(404)
      throw new Error('Feedback not found')
    }
  } catch (error) {
    res.status(500)
    throw new Error('Server error: ' + error.message)
  }
}

// @desc    Update feedback featured status
// @route   PUT /api/feedbacks/:id/featured
// @access  Private/Admin
export const updateFeedbackFeatured = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
    
    if (feedback) {
      feedback.featured = req.body.featured
      
      const updatedFeedback = await feedback.save()
      res.json(updatedFeedback)
    } else {
      res.status(404)
      throw new Error('Feedback not found')
    }
  } catch (error) {
    res.status(500)
    throw new Error('Server error: ' + error.message)
  }
}

// @desc    Delete feedback
// @route   DELETE /api/feedbacks/:id
// @access  Private/Admin
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
    
    if (feedback) {
      await feedback.deleteOne()
      res.json({ message: 'Feedback removed' })
    } else {
      res.status(404)
      throw new Error('Feedback not found')
    }
  } catch (error) {
    res.status(500)
    throw new Error('Server error: ' + error.message)
  }
}