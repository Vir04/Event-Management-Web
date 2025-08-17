import express from 'express'
import { protect, admin } from '../middleware/authMiddleware.js'
import {
  getDashboardStats,
  getAdminInquiries,
  getAdminFeedbacks,
  updateInquiryStatus
} from '../controllers/adminController.js'

const router = express.Router()

// Protected admin routes
router.use(protect)
router.use(admin)

router.get('/dashboard', getDashboardStats)
router.get('/inquiries', getAdminInquiries)
router.get('/feedbacks', getAdminFeedbacks)
router.put('/inquiries/:id/status', updateInquiryStatus)

export default router