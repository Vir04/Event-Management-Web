import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import { fadeIn } from '../../utils/animationUtils'
import '@splidejs/react-splide/css'
import './Hero.css'

const Hero = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false)

  // In Vite, we need to use the full path from the public directory
  const backgroundImages = [
    { id: 1, src: '/images/hero/wedding.jpg', alt: 'Wedding Event' },
    { id: 2, src: '/images/hero/party.jpg', alt: 'Party Event' },
    { id: 3, src: '/images/hero/corporate.jpg', alt: 'Corporate Event' },
    { id: 4, src: '/images/hero/anniversary.jpg', alt: 'Anniversary Event' },
    { id: 5, src: '/images/hero/celebration.jpg', alt: 'Celebration Event' }
  ]
  
  useEffect(() => {
    const loadImages = async () => {
      try {
        await Promise.all(
          backgroundImages.map(({ src }) => {
            return new Promise((resolve, reject) => {
              const img = new Image()
              img.src = src
              img.onload = resolve
              img.onerror = reject
            })
          })
        )
        setImagesLoaded(true)
      } catch (error) {
        console.error('Error loading images:', error)
        // Still set images as loaded to show something
        setImagesLoaded(true)
      }
    }

    loadImages()
  }, [])

  if (!imagesLoaded) {
    return (
      <div className="relative h-screen min-h-[600px] bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="hero-slider">
      {/* Background Slideshow */}
      <Splide
        options={{
          type: 'fade',
          rewind: true,
          arrows: false,
          pagination: false,
          autoplay: true,
          interval: 4000,
          speed: 1500,
          pauseOnHover: false,
        }}
      >
        {backgroundImages.map((image) => (
          <SplideSlide key={image.id}>
            <div 
              className="hero-slide-bg"
              style={{ 
                backgroundImage: `url(${image.src})`,
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-60"></div>
            </div>
          </SplideSlide>
        ))}
      </Splide>
      
      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-4">
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 max-w-4xl"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          Creating <span className="text-primary-400">Unforgettable</span> Memories for Your Special Day
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-200 mb-8 max-w-2xl"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          From weddings to birthdays, let us make your dream event come to life with our expert planning and coordination services.
        </motion.p>
      </div>
      
      {/* Scroll Down Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </div>
  )
}

export default Hero