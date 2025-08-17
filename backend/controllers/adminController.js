import User from '../models/userModel.js'
import Inquiry from '../models/inquiryModel.js'
import Feedback from '../models/feedbackModel.js'

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const totalClients = await User.countDocuments({ isAdmin: false })
    const totalInquiries = await Inquiry.countDocuments()
    const totalFeedbacks = await Feedback.countDocuments()

    // Get inquiries by type
    const inquiriesByType = {
      weddings: await Inquiry.countDocuments({ eventType: 'wedding' }),
      birthdays: await Inquiry.countDocuments({ eventType: 'birthday' }),
      anniversaries: await Inquiry.countDocuments({ eventType: 'anniversary' }),
      corporate: await Inquiry.countDocuments({ eventType: 'corporate' })
    }

    // Get inquiries by status
    const inquiriesByStatus = {
      pending: await Inquiry.countDocuments({ status: 'pending' }),
      handled: await Inquiry.countDocuments({ status: 'handled' })
    }

    // Get recent inquiries
    const recentInquiries = await Inquiry.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name eventType preferredDate status')

    // Get recent feedbacks
    const recentFeedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name eventType rating featured')

    res.json({
      success: true,
      totalClients,
      totalInquiries,
      totalFeedbacks,
      inquiriesByType,
      inquiriesByStatus,
      recentInquiries,
      recentFeedbacks
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics'
    })
  }
}

// @desc    Get all inquiries for admin
// @route   GET /api/admin/inquiries
// @access  Private/Admin
export const getAdminInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 })
    res.json(inquiries)
  } catch (error) {
    res.status(500)
    throw new Error('Server error: ' + error.message)
  }
}

// @desc    Get all feedbacks for admin
// @route   GET /api/admin/feedbacks
// @access  Private/Admin
export const getAdminFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({}).sort({ createdAt: -1 })
    res.json(feedbacks)
  } catch (error) {
    res.status(500)
    throw new Error('Server error: ' + error.message)
  }
}

// @desc    Update inquiry status
// @route   PUT /api/admin/inquiries/:id/status
// @access  Private/Admin
export const updateInquiryStatus = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
    
    if (!inquiry) {
      res.status(404)
      throw new Error('Inquiry not found')
    }
    
    inquiry.status = req.body.status
    const updatedInquiry = await inquiry.save()
    
    res.json(updatedInquiry)
  } catch (error) {
    res.status(500)
    throw new Error('Server error: ' + error.message)
  }
}