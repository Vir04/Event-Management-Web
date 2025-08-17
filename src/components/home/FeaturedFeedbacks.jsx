import { useState, useEffect } from 'react'
import { FaStar, FaQuoteRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'
import api from '../../utils/api'
import { slideUp } from '../../utils/animationUtils'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'
import './FeaturedFeedbacks.css'

const FeaturedFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true)
        const response = await api.get('/api/feedbacks')
        // Get latest 3 feedbacks
        setFeedbacks(response.data.slice(0, 3))
      } catch (err) {
        setError('Failed to load feedbacks')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeedbacks()
  }, [])

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <section className="section bg-gray-50 py-16">
        <div className="container-custom text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="section bg-gray-50 py-16">
        <div className="container-custom text-center">
          <p className="text-error-500">{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="section bg-gray-50 py-16">
      <div className="container-custom">
        <motion.div 
          className="text-center mb-12"
          variants={slideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">What Our Clients Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what some of our happy clients have to say about their experience with us.
          </p>
        </motion.div>

        <motion.div 
          className="max-w-5xl mx-auto relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {feedbacks.length > 0 ? (
            <Swiper
              modules={[Autoplay, Pagination, Navigation, EffectFade]}
              spaceBetween={30}
              slidesPerView={1}
              effect="fade"
              loop={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              navigation={{
                prevEl: '.swiper-button-prev',
                nextEl: '.swiper-button-next',
              }}
              className="testimonials-slider pb-12"
            >
              {feedbacks.map((feedback) => (
                <SwiperSlide key={feedback._id}>
                  <div className="bg-white rounded-xl shadow-md p-8 h-full">
                    <div className="flex items-center mb-6">
                      <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-2xl">
                        {feedback.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <h3 className="font-heading font-semibold text-xl">{feedback.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{feedback.eventType} Event</p>
                      </div>
                    </div>
                    <div className="flex space-x-1 mb-6">
                      {renderStars(feedback.rating)}
                    </div>
                    <p className="text-gray-700 text-lg italic mb-6">"{feedback.message}"</p>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">
                        {new Date(feedback.date || feedback.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-lg text-gray-600">No feedbacks submitted yet. Be the first to share your experience!</p>
            </div>
          )}
          <div className="swiper-button-prev !text-primary-500 !w-12 !h-12 !bg-white !rounded-full !shadow-md after:!text-xl"></div>
          <div className="swiper-button-next !text-primary-500 !w-12 !h-12 !bg-white !rounded-full !shadow-md after:!text-xl"></div>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedFeedbacks