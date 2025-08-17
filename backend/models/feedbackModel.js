import mongoose from 'mongoose'

const feedbackSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    eventType: {
      type: String,
      required: true,
      enum: ['wedding', 'birthday', 'corporate', 'anniversary', 'other']
    },
    eventDate: {
      type: Date,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    message: {
      type: String,
      required: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
)

const Feedback = mongoose.model('Feedback', feedbackSchema)

export default Feedback