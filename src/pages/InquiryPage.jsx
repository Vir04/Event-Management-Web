import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaInfoCircle, FaUser } from 'react-icons/fa'
import api from '../utils/api'
import '../styles/FormStyles.css'

const InquiryPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'wedding',
    preferredDate: '',
    location: '',
    message: ''
  })
  
  const eventTypes = [
    { id: 'wedding', label: 'Wedding' },
    { id: 'birthday', label: 'Birthday' },
    { id: 'anniversary', label: 'Anniversary' },
    { id: 'corporate', label: 'Corporate Event' },
    { id: 'other', label: 'Other' }
  ]
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Handle phone number validation
    if (name === 'phone') {
      const numbersOnly = value.replace(/\D/g, '')
      setFormData(prev => ({ ...prev, [name]: numbersOnly }))
      return
    }
    
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      await api.post('/api/inquiries', formData)
      
      toast.success('Inquiry submitted successfully! We will contact you soon.')
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventType: 'wedding',
        preferredDate: '',
        location: '',
        message: ''
      })
      
      // Redirect to homepage
      navigate('/')
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit inquiry')
    } finally {
      setLoading(false)
    }
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
            <h2 className="form-title">Make an Inquiry</h2>
            <p className="form-subtitle">
              Fill out the form below and we'll get back to you within 24 hours.
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
                      placeholder="Enter your full name"
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
                  <label htmlFor="phone" className="form-label">
                    Phone Number *
                  </label>
                  <div className="input-with-icon">
                    <FaPhoneAlt className="input-icon" />
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      pattern="[0-9]*"
                      className="form-input"
                      placeholder="Your contact number"
                    />
                  </div>
                </div>
                
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
              </div>
              
              <div className="form-grid">
                <div>
                  <label htmlFor="preferredDate" className="form-label">
                    Preferred Event Date *
                  </label>
                  <div className="input-with-icon">
                    <FaCalendarAlt className="input-icon" />
                    <input 
                      type="date" 
                      id="preferredDate" 
                      name="preferredDate" 
                      value={formData.preferredDate}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="location" className="form-label">
                    Location *
                  </label>
                  <div className="input-with-icon">
                    <FaMapMarkerAlt className="input-icon" />
                    <input 
                      type="text" 
                      id="location" 
                      name="location" 
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="City/Venue"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="form-label">
                  Your Message *
                </label>
                <div className="input-with-icon">
                  <FaInfoCircle className="input-icon-textarea" />
                  <textarea 
                    id="message" 
                    name="message" 
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="form-textarea"
                    placeholder="Tell us more about your event requirements..."
                    rows="4"
                  ></textarea>
                </div>
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
                  'Submit Inquiry'
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default InquiryPage