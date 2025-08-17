import express from 'express'
import {
  createInquiry,
  getInquiries,
  deleteInquiry,
  updateInquiryStatus
} from '../controllers/inquiryController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', createInquiry)
router.get('/', protect, admin, getInquiries)
router.delete('/:id', protect, admin, deleteInquiry)
router.put('/:id/status', protect, admin, updateInquiryStatus)

export default router