import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTwitter, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { containerVariants, itemVariants } from '../../utils/animationUtils'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Company Info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-heading font-semibold mb-4 text-primary-400">Shree Events</h3>
            <p className="text-gray-300 mb-4">
              Creating memorable moments for all your special occasions. We specialize in weddings, 
              birthdays, corporate events, and more.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                className="text-gray-300 hover:text-primary-400 transition-colors duration-300">
                <FaFacebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary-400 transition-colors duration-300">
                <FaInstagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary-400 transition-colors duration-300">
                <FaTwitter size={20} />
              </a>
            </div>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-heading font-semibold mb-4 text-primary-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary-400 transition-colors duration-300">Home</Link>
              </li>
              <li>
                <Link to="/inquire" className="text-gray-300 hover:text-primary-400 transition-colors duration-300">Inquiry</Link>
              </li>
              <li>
                <Link to="/feedback" className="text-gray-300 hover:text-primary-400 transition-colors duration-300">Feedback</Link>
              </li>
              <li>
                <Link to="/feedbacks" className="text-gray-300 hover:text-primary-400 transition-colors duration-300">Testimonials</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-primary-400 transition-colors duration-300">Admin Login</Link>
              </li>
            </ul>
          </motion.div>
          
          {/* Services */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-heading font-semibold mb-4 text-primary-400">Our Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Wedding Planning</li>
              <li className="text-gray-300">Birthday Celebrations</li>
              <li className="text-gray-300">Corporate Events</li>
              <li className="text-gray-300">Anniversary Parties</li>
              <li className="text-gray-300">Engagement Ceremonies</li>
            </ul>
          </motion.div>
          
          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-heading font-semibold mb-4 text-primary-400">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-primary-400 mt-1 mr-3" />
                <p className="text-gray-300">123 Event Street, Sangli, Maharashtra, India - 416416</p>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-primary-400 mr-3" />
                <p className="text-gray-300">+91 9876543210</p>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="text-primary-400 mr-3" />
                <p className="text-gray-300">info@shreeevents.com</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Copyright */}
        <div className="pt-8 mt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© {currentYear} Shree Events. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer