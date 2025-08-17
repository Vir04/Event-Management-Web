import { createContext, useState, useEffect, useContext } from 'react'
import api from '../utils/api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token')
        console.log('Checking auth status, token:', token ? 'exists' : 'none')
        
        if (!token) {
          setLoading(false)
          return
        }

        // Add token to api headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        const { data } = await api.get('/api/auth/verify')
        console.log('Auth verification response:', data)
        
        if (data.success && data.user && data.user.isAdmin) {
          console.log('Setting authenticated state for admin user')
          setIsAuthenticated(true)
          setUser(data.user)
        } else {
          console.log('Auth verification failed, clearing token')
          localStorage.removeItem('token')
          delete api.defaults.headers.common['Authorization']
        }
      } catch (error) {
        console.error('Auth verification error:', error.response || error)
        localStorage.removeItem('token')
        delete api.defaults.headers.common['Authorization']
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      console.log('Attempting login...')
      const { data } = await api.post('/api/auth/login', { email, password })
      console.log('Login response:', data)
      
      // Check if user exists and is admin
      if (!data._id || !data.isAdmin) {
        console.log('Login failed: not an admin user')
        return { 
          success: false, 
          message: 'Access denied. Admin privileges required.' 
        }
      }

      localStorage.setItem('token', data.token)
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      setIsAuthenticated(true)
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin
      })
      return { success: true }
    } catch (error) {
      console.error('Login error:', error.response || error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please try again.' 
      }
    }
  }

  // Logout function
  const logout = () => {
    console.log('Logging out...')
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setIsAuthenticated(false)
    setUser(null)
  }

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}