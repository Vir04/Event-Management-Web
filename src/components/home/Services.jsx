import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaRing, FaBirthdayCake, FaGlassCheers, FaBuilding, FaTimes, FaCalendarAlt } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { containerVariants } from '../../utils/animationUtils'

const Services = () => {
  const [selectedService, setSelectedService] = useState(null)
  const navigate = useNavigate()

  const services = [
    {
      icon: <FaRing />,
      title: 'Wedding Events',
      description: 'From intimate gatherings to grand celebrations, we create the perfect wedding day with attention to every detail.',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80',
      fullDescription: `Our wedding planning services include:
        • Venue selection and decoration
        • Catering and menu planning
        • Photography and videography coordination
        • Entertainment and music arrangements
        • Guest list management and invitations
        • Complete day-of coordination`
    },
    {
      icon: <FaBirthdayCake />,
      title: 'Birthday Parties',
      description: 'Make your special day memorable with our customized birthday planning services for all ages.',
      image: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&q=80',
      fullDescription: `We handle birthdays for all ages:
        • Theme development and decoration
        • Entertainment and activities
        • Custom cake and catering
        • Party favors and gifts
        • Photography services
        • Games and music coordination`
    },
    {
      icon: <FaGlassCheers />,
      title: 'Anniversary Celebrations',
      description: 'Celebrate your love story with our carefully crafted anniversary event planning services.',
      image: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80',
      fullDescription: `Create lasting memories with our anniversary packages:
        • Romantic venue selection
        • Special dinner arrangements
        • Personalized decorations
        • Photography sessions
        • Live music or entertainment
        • Custom gift arrangements`
    },
    {
      icon: <FaBuilding />,
      title: 'Corporate Events',
      description: 'Impress your clients and motivate your team with our professional corporate event management.',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80',
      fullDescription: `Professional corporate event solutions:
        • Conference and seminar organization
        • Team building activities
        • Product launch events
        • Award ceremonies
        • Networking events
        • Complete logistics management`
    }
  ]

  const handleBooking = (eventType) => {
    navigate('/inquire', { state: { eventType } })
  }

  const handleCloseModal = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setSelectedService(null)
  }

  return (
    <section className="section bg-white py-16">
      <div className="container-custom">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Our Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We specialize in creating unforgettable experiences for all types of events.
            Let us help you turn your vision into reality.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={() => setSelectedService(service)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="text-white text-4xl">
                    {service.icon}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-heading font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Service Details Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div 
              className="bg-white rounded-lg max-w-2xl w-full overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64">
                <img 
                  src={selectedService.image} 
                  alt={selectedService.title}
                  className="w-full h-full object-cover"
                />
                <button 
                  className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors p-2 bg-black bg-opacity-50 rounded-full"
                  onClick={handleCloseModal}
                  aria-label="Close modal"
                >
                  <FaTimes size={24} />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center mb-2">
                    <span className="text-3xl mr-3">
                      {selectedService.icon}
                    </span>
                    <h3 className="text-2xl font-heading font-bold">{selectedService.title}</h3>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="prose max-w-none text-gray-600 mb-6">
                  {selectedService.fullDescription.split('\n').map((text, index) => (
                    <p key={index} className="mb-2">{text}</p>
                  ))}
                </div>
                <button 
                  className="group w-1/4 bg-primary-500 hover:bg-primary-600 text-white py-2.5 px-6 rounded-lg transition-all duration-300 flex items-center justify-center mx-auto space-x-2 transform hover:scale-[1.02]"
                  onClick={() => handleBooking(selectedService.title.toLowerCase().split(' ')[0])}
                >
                  <span className="font-medium">Inquiry</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Services