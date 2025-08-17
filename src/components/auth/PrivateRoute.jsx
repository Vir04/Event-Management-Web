import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth()
  
  // Show loading state if authentication status is still being checked
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }
  
  // Render outlet if authenticated (child routes)
  return <Outlet />
}

export default PrivateRoute