import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { animateCounter } from '../../utils/animationUtils'

const StatsCounter = ({ icon, title, value, color = 'primary', delay = 0 }) => {
  const counterRef = useRef(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const controls = animateCounter(counterRef, value)
          return () => controls.stop()
        }
      },
      { threshold: 0.5 }
    )
    
    if (counterRef.current) {
      observer.observe(counterRef.current)
    }
    
    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current)
      }
    }
  }, [value])
  
  const getColorClass = () => {
    const colors = {
      primary: 'text-primary-500',
      secondary: 'text-secondary-500',
      accent: 'text-accent-500',
      success: 'text-success-500'
    }
    return colors[color] || colors.primary
  }
  
  return (
    <motion.div 
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className={`text-4xl mb-2 ${getColorClass()}`}>
        {icon}
      </div>
      <h3 className="text-3xl font-heading font-bold mb-1">
        <span ref={counterRef}>0</span>+
      </h3>
      <p className="text-gray-600 font-medium">{title}</p>
    </motion.div>
  )
}

StatsCounter.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  color: PropTypes.string,
  delay: PropTypes.number
}

export default StatsCounter