import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { FaEdit, FaTrash, FaSearch, FaFilter, FaChevronLeft, FaChevronRight, FaSave, FaTimes, FaStar } from 'react-icons/fa'
import api from '../../utils/api'

const ManageFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filtering and pagination states
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [feedbacksPerPage] = useState(10)
  
  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('') // 'edit' or 'delete'
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    eventType: '',
    eventDate: '',
    rating: 5,
    message: '',
    featured: false
  })
  
  // Available event types
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
      const response = await api.get('/api/admin/feedbacks')
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
      
    const matchesType = filter === 'all' || feedback.eventType === filter
    
    return matchesSearch && matchesType
  })
  
  // Get current feedbacks for pagination
  const indexOfLastFeedback = currentPage * feedbacksPerPage
  const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage
  const currentFeedbacks = filteredFeedbacks.slice(indexOfFirstFeedback, indexOfLastFeedback)
  const totalPages = Math.ceil(filteredFeedbacks.length / feedbacksPerPage)
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  // Format date for input field
  const formatDateForInput = (dateString) => {
    return new Date(dateString).toISOString().split('T')[0]
  }
  
  // Render star rating
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar 
        key={index} 
        className={`inline ${index < rating ? 'text-yellow-500' : 'text-gray-300'}`} 
      />
    ))
  }
  
  // Handle edit click
  const handleEditClick = (feedback) => {
    setSelectedFeedback(feedback)
    setEditFormData({
      name: feedback.name,
      email: feedback.email,
      eventType: feedback.eventType,
      eventDate: formatDateForInput(feedback.eventDate),
      rating: feedback.rating,
      message: feedback.message,
      featured: feedback.featured || false
    })
    setModalType('edit')
    setShowModal(true)
  }
  
  // Handle delete click
  const handleDeleteClick = (feedback) => {
    setSelectedFeedback(feedback)
    setModalType('delete')
    setShowModal(true)
  }
  
  // Handle form change for edit modal
  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditFormData({
      ...editFormData,
      [name]: type === 'checkbox' ? checked : value
    })
  }
  
  // Handle rating change
  const handleRatingChange = (newRating) => {
    setEditFormData({
      ...editFormData,
      rating: newRating
    })
  }
  
  // Handle edit submit
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await api.put(`/api/admin/feedbacks/${selectedFeedback._id}`, editFormData)
      
      // Update feedbacks state with edited feedback
      setFeedbacks(feedbacks.map(feedback => 
        feedback._id === selectedFeedback._id ? response.data : feedback
      ))
      
      toast.success('Feedback updated successfully')
      setShowModal(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update feedback')
    }
  }
  
  // Handle delete submit
  const handleDeleteSubmit = async () => {
    try {
      await api.delete(`/api/admin/feedbacks/${selectedFeedback._id}`)
      
      // Remove deleted feedback from state
      setFeedbacks(feedbacks.filter(feedback => feedback._id !== selectedFeedback._id))
      
      toast.success('Feedback deleted successfully')
      setShowModal(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete feedback')
    }
  }
  
  // Toggle feedback featured status
  const toggleFeatured = async (feedback) => {
    try {
      const updatedData = { featured: !feedback.featured }
      const response = await api.put(`/api/admin/feedbacks/${feedback._id}/featured`, updatedData)
      
      // Update feedbacks state
      setFeedbacks(feedbacks.map(f => 
        f._id === feedback._id ? response.data : f
      ))
      
      toast.success(`Feedback ${response.data.featured ? 'added to' : 'removed from'} featured list`)
    } catch (error) {
      toast.error('Failed to update featured status')
    }
  }
  
  // Star rating component for edit form
  const StarRating = ({ rating, onRatingChange }) => {
    const [hover, setHover] = useState(null)
    
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1
          
          return (
            <label 
              key={index} 
              className="cursor-pointer"
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
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-heading font-bold">Manage Feedbacks</h1>
        </div>
        
        {/* Filters */}
        <motion.div 
          className="mb-6 p-4 bg-white rounded-lg shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            {/* Search */}
            <div className="relative flex-grow mb-4 md:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search feedbacks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            
            {/* Filter by Event Type */}
            <div className="flex items-center flex-shrink-0">
              <FaFilter className="text-gray-400 mr-2" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input-field"
              >
                {eventTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
        
        {/* Feedbacks Table */}
        <motion.div 
          className="bg-white rounded-lg shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {currentFeedbacks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentFeedbacks.map((feedback) => (
                    <tr key={feedback._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{feedback.name}</div>
                        <div className="text-sm text-gray-500">{feedback.email}</div>
                        <div className="text-sm text-gray-500">
                          {feedback.eventType.charAt(0).toUpperCase() + feedback.eventType.slice(1)}
                        </div>
                        <div className="text-sm text-gray-500">{formatDate(feedback.eventDate)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {feedback.message}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Submitted: {formatDate(feedback.date || feedback.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex">
                          {renderStars(feedback.rating)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleFeatured(feedback)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            feedback.featured 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {feedback.featured ? 'Featured' : 'Not Featured'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleEditClick(feedback)}
                          className="text-accent-500 hover:text-accent-600 mr-3"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(feedback)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No feedbacks found matching your criteria</p>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstFeedback + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastFeedback, filteredFeedbacks.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredFeedbacks.length}</span> results
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 border'
                  }`}
                >
                  <FaChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 border'
                  }`}
                >
                  <FaChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Edit/Delete Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" onClick={() => setShowModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {modalType === 'edit' ? (
                <div>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-heading font-bold text-gray-900">Edit Feedback</h3>
                      <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">
                        <FaTimes />
                      </button>
                    </div>
                    
                    <form onSubmit={handleEditSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Client Name
                          </label>
                          <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            value={editFormData.name}
                            onChange={handleEditFormChange}
                            required
                            className="input-field"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={editFormData.email}
                            onChange={handleEditFormChange}
                            required
                            className="input-field"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                            Event Type
                          </label>
                          <select 
                            id="eventType" 
                            name="eventType" 
                            value={editFormData.eventType}
                            onChange={handleEditFormChange}
                            required
                            className="input-field"
                          >
                            {eventTypes.filter(type => type.id !== 'all').map(type => (
                              <option key={type.id} value={type.id}>{type.label}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Event Date
                          </label>
                          <input 
                            type="date" 
                            id="eventDate" 
                            name="eventDate" 
                            value={editFormData.eventDate}
                            onChange={handleEditFormChange}
                            required
                            className="input-field"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rating
                        </label>
                        <StarRating rating={editFormData.rating} onRatingChange={handleRatingChange} />
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          Feedback Message
                        </label>
                        <textarea 
                          id="message" 
                          name="message" 
                          value={editFormData.message}
                          onChange={handleEditFormChange}
                          required
                          rows="3"
                          className="input-field"
                        ></textarea>
                      </div>
                      
                      <div className="mb-4">
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            name="featured" 
                            checked={editFormData.featured}
                            onChange={handleEditFormChange}
                            className="rounded text-primary-500 focus:ring-primary-500 h-4 w-4 mr-2"
                          />
                          <span className="text-sm text-gray-700">Feature this feedback on homepage</span>
                        </label>
                      </div>
                      
                      <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                        <button 
                          type="submit" 
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-500 text-base font-medium text-white hover:bg-primary-600 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          <FaSave className="mr-2" /> Save Changes
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setShowModal(false)}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div>
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <h3 className="text-lg font-heading font-bold text-gray-900 mb-4">Confirm Deletion</h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete the feedback from <span className="font-semibold">{selectedFeedback?.name}</span>? 
                          This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                    <button 
                      type="button" 
                      onClick={handleDeleteSubmit}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-600 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Delete
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowModal(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageFeedbacks