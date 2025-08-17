import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { FaTrash, FaSearch, FaFilter, FaCheck, FaClock } from 'react-icons/fa'
import api from '../../utils/api'

const ManageInquiries = () => {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filtering states
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  
  // Available event types for filtering
  const eventTypes = [
    { id: 'all', label: 'All Events' },
    { id: 'wedding', label: 'Wedding' },
    { id: 'birthday', label: 'Birthday' },
    { id: 'anniversary', label: 'Anniversary' },
    { id: 'corporate', label: 'Corporate Event' },
    { id: 'other', label: 'Other' }
  ]
  
  useEffect(() => {
    fetchInquiries()
  }, [])
  
  const fetchInquiries = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/inquiries')
      setInquiries(response.data)
    } catch (err) {
      setError('Failed to load inquiries')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  
  // Filter inquiries based on search term and event type
  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = search === '' || 
      inquiry.name.toLowerCase().includes(search.toLowerCase()) || 
      inquiry.location.toLowerCase().includes(search.toLowerCase())
      
    const matchesType = filter === 'all' || inquiry.eventType === filter
    
    return matchesSearch && matchesType
  })

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await api.put(`/api/inquiries/${id}/status`, { status: newStatus })
      
      setInquiries(inquiries.map(inquiry => 
        inquiry._id === id ? response.data : inquiry
      ))
      
      toast.success(`Inquiry marked as ${newStatus}`)
    } catch (error) {
      toast.error('Failed to update inquiry status')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this inquiry?')) {
      try {
        await api.delete(`/api/inquiries/${id}`)
        setInquiries(inquiries.filter(inquiry => inquiry._id !== id))
        toast.success('Inquiry deleted successfully')
      } catch (error) {
        toast.error('Failed to delete inquiry')
      }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
            onClick={fetchInquiries}
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
          <h1 className="text-3xl font-heading font-bold">Manage Inquiries</h1>
        </div>
        
        {/* Filters */}
        <motion.div 
          className="mb-6 p-4 bg-white rounded-lg shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="relative flex-grow mb-4 md:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search inquiries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            
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
        
        {/* Inquiries Table */}
        <motion.div 
          className="bg-white rounded-lg shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {filteredInquiries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredInquiries.map((inquiry) => (
                    <tr key={inquiry._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                        <div className="text-sm text-gray-500">{inquiry.email}</div>
                        <div className="text-sm text-gray-500">{inquiry.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {inquiry.eventType.charAt(0).toUpperCase() + inquiry.eventType.slice(1)}
                        </div>
                        <div className="text-sm text-gray-500">Date: {formatDate(inquiry.preferredDate)}</div>
                        <div className="text-sm text-gray-500">Location: {inquiry.location}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">{inquiry.message}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {inquiry.status === 'pending' ? (
                          <button
                            onClick={() => handleStatusUpdate(inquiry._id, 'handled')}
                            className="flex items-center text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full hover:bg-yellow-200"
                          >
                            <FaClock className="mr-1" /> Pending
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusUpdate(inquiry._id, 'pending')}
                            className="flex items-center text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full hover:bg-green-200"
                          >
                            <FaCheck className="mr-1" /> Handled
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleDelete(inquiry._id)}
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
              <p className="text-gray-500">No inquiries found matching your criteria</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default ManageInquiries