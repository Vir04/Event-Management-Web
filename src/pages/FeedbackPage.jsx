import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { FaStar, FaCalendarAlt, FaEnvelope, FaUser } from 'react-icons/fa'
import api from '../utils/api'
import '../styles/FormStyles.css'

const FeedbackPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    eventType: 'wedding',
    eventDate: '',
    rating: 5,
    message: ''
  })
  
  // Available event types
  const eventTypes = [
    { id: 'wedding', label: 'Wedding' },
    { id: 'birthday', label: 'Birthday' },
    { id: 'corporate', label: 'Corporate Event' },
    { id: 'anniversary', label: 'Anniversary' },
    { id: 'other', label: 'Other' }
  ]
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  
  const handleRatingChange = (newRating) => {
    setFormData({
      ...formData,
      rating: newRating
    })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      await api.post('/api/feedbacks', formData)
      
      toast.success('Feedback submitted successfully!')
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        eventType: 'wedding',
        eventDate: '',
        rating: 5,
        message: ''
      })
      
      // Redirect to all feedbacks page after success
      navigate('/feedbacks')
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback')
    } finally {
      setLoading(false)
    }
  }
  
  // Star rating component
  const StarRating = ({ rating, onRatingChange }) => {
    const [hover, setHover] = useState(null)
    
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1
          
          return (
            <label 
              key={index} 
              className="cursor-pointer transform hover:scale-110 transition-transform"
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            >
              <input
                type="radio"
                name="rating"
                value={ratingValue}
                className="hidden"
                onClick={() => onRatingChange(ratingValue)}
              />
              <FaStar 
                className="text-2xl mr-1 transition-colors duration-200" 
                color={(hover || rating) >= ratingValue ? '#FFC107' : '#e4e5e9'} 
              />
            </label>
          )
        })}
      </div>
    )
  }
  
  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container-custom py-12">
        <motion.div 
          className="form-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="form-header">
            <h2 className="form-title">Share Your Experience</h2>
            <p className="form-subtitle">
              We value your feedback! Please share your thoughts about your recent event with us.
            </p>
          </div>
          
          <div className="form-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-grid">
                <div>
                  <label htmlFor="name" className="form-label">
                    Your Name *
                  </label>
                  <div className="input-with-icon">
                    <FaUser className="input-icon" />
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="form-label">
                    Email Address *
                  </label>
                  <div className="input-with-icon">
                    <FaEnvelope className="input-icon" />
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-grid">
                <div>
                  <label htmlFor="eventType" className="form-label">
                    Event Type *
                  </label>
                  <div className="input-with-icon">
                    <FaCalendarAlt className="input-icon" />
                    <select 
                      id="eventType" 
                      name="eventType" 
                      value={formData.eventType}
                      onChange={handleChange}
                      required
                      className="form-select"
                    >
                      {eventTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="eventDate" className="form-label">
                    Event Date *
                  </label>
                  <div className="input-with-icon">
                    <FaCalendarAlt className="input-icon" />
                    <input 
                      type="date" 
                      id="eventDate" 
                      name="eventDate" 
                      value={formData.eventDate}
                      onChange={handleChange}
                      required
                      max={new Date().toISOString().split('T')[0]}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="form-label">
                  Your Rating *
                </label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <StarRating rating={formData.rating} onRatingChange={handleRatingChange} />
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="form-label">
                  Your Feedback *
                </label>
                <textarea 
                  id="message" 
                  name="message" 
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="form-textarea"
                  placeholder="Please share your experience with us..."
                  rows="4"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="form-submit"
              >
                {loading ? (
                  <span className="form-loading">
                    <svg className="form-loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Feedback'
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default FeedbackPage