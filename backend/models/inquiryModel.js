import mongoose from 'mongoose'

const inquirySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: ['wedding', 'birthday', 'anniversary', 'corporate', 'other']
    },
    preferredDate: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'handled'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
)

const Inquiry = mongoose.model('Inquiry', inquirySchema)

export default Inquiry