import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const CallToAction = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-center bg-cover bg-fixed"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80')",
          filter: "brightness(0.3)"
        }}
      />
      
      {/* Content */}
      <div className="container-custom relative z-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
            Ready to Create Your Dream Event?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Let's work together to design an unforgettable experience that you and your guests will cherish forever.
          </p>
          <Link 
            to="/inquire" 
            className="inline-block btn-primary text-lg px-10 py-4 rounded-full hover:scale-105 transform transition duration-300"
          >
            Start Planning Your Event
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default CallToAction