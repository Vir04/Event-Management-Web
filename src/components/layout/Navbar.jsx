import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaBars, FaTimes, FaRegGem } from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    closeMenu()
  }, [location.pathname])

  const navbarClass = isScrolled 
    ? 'bg-white shadow-md py-3 transition-all duration-300' 
    : 'bg-transparent py-5 transition-all duration-300'

  const textColor = isScrolled || location.pathname !== '/' 
    ? 'text-gray-800' 
    : 'text-white'

  const getLinkClass = (path) => {
    const baseClass = `relative px-3 py-2 font-medium transition-all duration-300 hover:text-primary-500 ${textColor}`
    const activeClass = 'text-primary-500 before:content-[""] before:absolute before:bottom-0 before:left-0 before:w-full before:h-0.5 before:bg-primary-500'
    
    return location.pathname === path ? `${baseClass} ${activeClass}` : baseClass
  }

  return (
    <nav className={`fixed w-full z-50 ${navbarClass}`}>
      <div className="container-custom flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <FaRegGem className={`text-primary-500 text-2xl mr-2 transform group-hover:rotate-12 transition-transform duration-300`} />
            <div className="font-heading flex items-baseline">
              <span className="text-2xl font-black tracking-wider text-primary-500 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">SHREE</span>
              <span className={`text-2xl font-light tracking-wide ${textColor} ml-2`}>EVENTS</span>
            </div>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-1">
          <Link to="/" className={getLinkClass('/')}>Home</Link>
          <Link to="/inquire" className={getLinkClass('/inquire')}>Inquiry</Link>
          <Link to="/feedback" className={getLinkClass('/feedback')}>Feedback</Link>
          <Link to="/feedbacks" className={getLinkClass('/feedbacks')}>Testimonials</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/admin" className={getLinkClass('/admin')}>Dashboard</Link>
              <button 
                onClick={logout} 
                className="ml-2 px-4 py-1.5 text-white bg-secondary-500 rounded hover:bg-secondary-600 transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <Link 
              to="/admin/login" 
              className="ml-2 px-4 py-1.5 text-white bg-primary-500 rounded hover:bg-primary-600 transition duration-300"
            >
              Admin Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-2xl focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes className={textColor} /> : <FaBars className={textColor} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white shadow-lg"
        >
          <div className="container-custom py-4 flex flex-col space-y-3">
            <Link to="/" className="py-2 text-gray-800 hover:text-primary-500">Home</Link>
            <Link to="/inquire" className="py-2 text-gray-800 hover:text-primary-500">Make an Inquiry</Link>
            <Link to="/feedback" className="py-2 text-gray-800 hover:text-primary-500">Submit Feedback</Link>
            <Link to="/feedbacks" className="py-2 text-gray-800 hover:text-primary-500">All Feedbacks</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/admin" className="py-2 text-gray-800 hover:text-primary-500">Dashboard</Link>
                <button 
                  onClick={logout} 
                  className="py-2 text-left text-secondary-500 hover:text-secondary-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/admin/login" 
                className="py-2 text-primary-500 hover:text-primary-600 font-medium"
              >
                Admin Login
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  )
}

export default Navbar