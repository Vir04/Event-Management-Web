import Inquiry from '../models/inquiryModel.js'

// @desc    Create new inquiry
// @route   POST /api/inquiries
// @access  Public
export const createInquiry = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      eventType,
      preferredDate,
      location,
      message
    } = req.body

    const inquiry = await Inquiry.create({
      name,
      email,
      phone,
      eventType,
      preferredDate,
      location,
      message
    })

    res.status(201).json(inquiry)
  } catch (error) {
    res.status(400)
    throw new Error(error.message)
  }
}

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private/Admin
export const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 })
    res.json(inquiries)
  } catch (error) {
    res.status(500)
    throw new Error('Server error: ' + error.message)
  }
}

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private/Admin
export const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
    
    if (inquiry) {
      await inquiry.deleteOne()
      res.json({ message: 'Inquiry removed' })
    } else {
      res.status(404)
      throw new Error('Inquiry not found')
    }
  } catch (error) {
    res.status(500)
    throw new Error('Server error: ' + error.message)
  }
}

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id/status
// @access  Private/Admin
export const updateInquiryStatus = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
    
    if (inquiry) {
      inquiry.status = req.body.status
      const updatedInquiry = await inquiry.save()
      res.json(updatedInquiry)
    } else {
      res.status(404)
      throw new Error('Inquiry not found')
    }
  } catch (error) {
    res.status(500)
    throw new Error('Server error: ' + error.message)
  }
}