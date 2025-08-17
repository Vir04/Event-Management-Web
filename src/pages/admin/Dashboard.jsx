import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { 
  FaCalendarCheck, 
  FaComments, 
  FaUsers, 
  FaChartLine, 
  FaBirthdayCake, 
  FaRing,
  FaBusinessTime,
  FaGlassCheers
} from 'react-icons/fa'
import api from '../../utils/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalInquiries: 0,
    inquiriesByType: {
      weddings: 0,
      birthdays: 0,
      anniversaries: 0,
      corporate: 0
    },
    inquiriesByStatus: {
      pending: 0,
      handled: 0
    },
    totalFeedbacks: 0,
    recentInquiries: [],
    recentFeedbacks: []
  })
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await api.get('/api/admin/dashboard')
      if (data) {
        setStats(data)
      } else {
        throw new Error('No data received from server')
      }
    } catch (err) {
      console.error('Dashboard error:', err)
      setError(err.response?.data?.message || 'Failed to load dashboard data')
      toast.error(err.response?.data?.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

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
            onClick={fetchDashboardData}
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex space-x-4">
            <button 
              onClick={fetchDashboardData}
              className="btn bg-primary-50 text-primary-600 hover:bg-primary-100"
            >
              Refresh Data
            </button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Total Inquiries */}
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <div className="rounded-full bg-primary-100 p-4 mr-4">
              <FaCalendarCheck className="text-2xl text-primary-500" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Inquiries</p>
              <h3 className="text-2xl font-bold">{stats.totalInquiries || 0}</h3>
            </div>
          </div>

          {/* Total Clients */}
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <div className="rounded-full bg-secondary-100 p-4 mr-4">
              <FaUsers className="text-2xl text-secondary-500" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Clients</p>
              <h3 className="text-2xl font-bold">{stats.totalClients || 0}</h3>
            </div>
          </div>

          {/* Pending Inquiries */}
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <div className="rounded-full bg-accent-100 p-4 mr-4">
              <FaCalendarCheck className="text-2xl text-accent-500" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Pending Inquiries</p>
              <h3 className="text-2xl font-bold">{stats.inquiriesByStatus?.pending || 0}</h3>
            </div>
          </div>

          {/* Total Feedbacks */}
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <div className="rounded-full bg-success-100 p-4 mr-4">
              <FaComments className="text-2xl text-success-500" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Feedbacks</p>
              <h3 className="text-2xl font-bold">{stats.totalFeedbacks || 0}</h3>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              to="/admin/inquiries" 
              className="btn bg-primary-50 text-primary-600 hover:bg-primary-100 py-3 flex items-center justify-center"
            >
              <FaCalendarCheck className="mr-2" /> Manage Inquiries
            </Link>
            <Link 
              to="/admin/feedbacks" 
              className="btn bg-secondary-50 text-secondary-600 hover:bg-secondary-100 py-3 flex items-center justify-center"
            >
              <FaComments className="mr-2" /> Manage Feedbacks
            </Link>
            <button className="btn bg-accent-50 text-accent-600 hover:bg-accent-100 py-3 flex items-center justify-center">
              <FaUsers className="mr-2" /> View Clients
            </button>
            <button className="btn bg-gray-100 text-gray-700 hover:bg-gray-200 py-3 flex items-center justify-center">
              <FaChartLine className="mr-2" /> Generate Reports
            </button>
          </div>
        </motion.div>

        {/* Event Type Stats */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="bg-white rounded-lg shadow-md p-6">
            <FaRing className="text-3xl text-secondary-500 mb-4" />
            <p className="text-gray-500">Weddings</p>
            <h4 className="text-xl font-bold">{stats.inquiriesByType?.weddings || 0}</h4>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <FaBirthdayCake className="text-3xl text-accent-500 mb-4" />
            <p className="text-gray-500">Birthdays</p>
            <h4 className="text-xl font-bold">{stats.inquiriesByType?.birthdays || 0}</h4>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <FaGlassCheers className="text-3xl text-success-500 mb-4" />
            <p className="text-gray-500">Anniversaries</p>
            <h4 className="text-xl font-bold">{stats.inquiriesByType?.anniversaries || 0}</h4>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <FaBusinessTime className="text-3xl text-primary-500 mb-4" />
            <p className="text-gray-500">Corporate</p>
            <h4 className="text-xl font-bold">{stats.inquiriesByType?.corporate || 0}</h4>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Inquiries */}
          <motion.div 
            className="bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-heading font-bold">Recent Inquiries</h2>
              <Link to="/admin/inquiries" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                View All
              </Link>
            </div>
            
            {stats.recentInquiries?.length > 0 ? (
              <div className="space-y-4">
                {stats.recentInquiries.map((inquiry) => (
                  <div key={inquiry._id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{inquiry.name}</h3>
                        <p className="text-sm text-gray-500">
                          {inquiry.eventType.charAt(0).toUpperCase() + inquiry.eventType.slice(1)} • 
                          {new Date(inquiry.preferredDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        inquiry.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent inquiries</p>
            )}
          </motion.div>

          {/* Recent Feedbacks */}
          <motion.div 
            className="bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-heading font-bold">Recent Feedbacks</h2>
              <Link to="/admin/feedbacks" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                View All
              </Link>
            </div>

            {stats.recentFeedbacks?.length > 0 ? (
              <div className="space-y-4">
                {stats.recentFeedbacks.map((feedback) => (
                  <div key={feedback._id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{feedback.name}</h3>
                        <p className="text-sm text-gray-500">
                          {feedback.eventType.charAt(0).toUpperCase() + feedback.eventType.slice(1)} • 
                          Rating: {feedback.rating}/5
                        </p>
                      </div>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        feedback.featured 
                          ? 'bg-primary-100 text-primary-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {feedback.featured ? 'Featured' : 'Standard'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent feedbacks</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard