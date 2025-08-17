import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { FaStar, FaRegStar } from 'react-icons/fa'

const FeedbackCard = ({ feedback, delay = 0 }) => {
  const { name, eventType, message, rating, date } = feedback
  
  // Format date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
  
  // Generate star rating
  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-500" />)
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />)
      }
    }
    return stars
  }
  
  return (
    <motion.div 
      className="card p-6 h-full flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-xl">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="ml-4">
          <h3 className="font-heading font-semibold">{name}</h3>
          <p className="text-sm text-gray-500">{eventType}</p>
        </div>
      </div>
      
      <div className="mb-3 flex">
        {renderStars(rating)}
      </div>
      
      <p className="text-gray-600 mb-4 flex-grow">"{message}"</p>
      
      <div className="text-xs text-gray-500 mt-auto">
        {formattedDate}
      </div>
    </motion.div>
  )
}

FeedbackCard.propTypes = {
  feedback: PropTypes.shape({
    name: PropTypes.string.isRequired,
    eventType: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired
  }).isRequired,
  delay: PropTypes.number
}

export default FeedbackCard