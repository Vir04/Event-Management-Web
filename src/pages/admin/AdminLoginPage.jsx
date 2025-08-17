import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { FaEnvelope, FaLock } from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'
import '../../styles/FormStyles.css'

const AdminLoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  // Clear form fields when component mounts
  useEffect(() => {
    setEmail('')
    setPassword('')
    // Reset form to prevent browser autofill
    const form = document.getElementById('adminLoginForm')
    if (form) form.reset()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoginError(null)
    setIsLoading(true)

    try {
      const result = await login(email, password)
      if (result.success) {
        toast.success('Login successful!')
        navigate('/admin')
      } else {
        setLoginError(result.message || 'Login failed. Please check your credentials.')
      }
    } catch (error) {
      console.error('Login error:', error)
      setLoginError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="form-container max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="form-header text-center">
          <h2 className="form-title">Admin Login</h2>
          <p className="form-subtitle">
            Access the admin dashboard to manage bookings and feedbacks
          </p>
        </div>
        
        <div className="form-body">
          <form id="adminLoginForm" className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
            {loginError && (
              <div className="form-error">
                {loginError}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="off"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="admin@example.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="••••••••"
                  minLength="6"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="form-submit"
            >
              {isLoading ? (
                <span className="form-loading">
                  <svg className="form-loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an admin account?{' '}
              <Link to="/admin/register" className="text-primary-500 hover:text-primary-600 font-medium">
                Create new admin account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLoginPage