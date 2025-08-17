import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaSearch } from 'react-icons/fa'
import FeedbackCard from '../components/common/FeedbackCard'
import { containerVariants } from '../utils/animationUtils'
import api from '../utils/api'

const AllFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  
  // Filter options
  const eventTypes = [
    { id: 'all', label: 'All Events' },
    { id: 'wedding', label: 'Wedding' },
    { id: 'birthday', label: 'Birthday' },
    { id: 'corporate', label: 'Corporate Event' },
    { id: 'anniversary', label: 'Anniversary' },
    { id: 'other', label: 'Other' }
  ]
  
  useEffect(() => {
    window.scrollTo(0, 0)
    fetchFeedbacks()
  }, [])
  
  const fetchFeedbacks = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/feedbacks')
      setFeedbacks(response.data)
    } catch (err) {
      setError('Failed to load feedbacks')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  
  // Filter feedbacks based on search term and event type
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = search === '' || 
      feedback.name.toLowerCase().includes(search.toLowerCase()) || 
      feedback.message.toLowerCase().includes(search.toLowerCase())
      
    const matchesType = filterType === 'all' || feedback.eventType === filterType
    
    return matchesSearch && matchesType
  })
  
  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen pt-20 flex justify-center items-center">
        <div className="text-center">
          <p className="text-xl text-error-500 mb-4">{error}</p>
          <button 
            onClick={fetchFeedbacks}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container-custom py-12">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">Client Testimonials</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Read what our clients have to say about their experience with our event management services.
          </p>
        </motion.div>
        
        {/* Filters */}
        <motion.div 
          className="mb-8 p-4 bg-white rounded-lg shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            {/* Search */}
            <div className="relative flex-grow mb-4 md:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search testimonials..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            
            {/* Filter by Event Type */}
            <div className="flex-shrink-0">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="input-field"
              >
                {eventTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
        
        {/* Feedbacks Grid */}
        {filteredFeedbacks.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredFeedbacks.map((feedback, index) => (
              <FeedbackCard 
                key={feedback._id} 
                feedback={feedback} 
                delay={index * 0.05}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-xl text-gray-500">No testimonials found matching your criteria.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AllFeedbacks