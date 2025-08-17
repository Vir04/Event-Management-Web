import { FaUsers, FaRing, FaBirthdayCake, FaComments } from 'react-icons/fa'
import { motion } from 'framer-motion'
import StatsCounter from '../common/StatsCounter'
import { containerVariants } from '../../utils/animationUtils'

const Stats = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Our Success in Numbers</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We take pride in the trust our clients place in us. Here's a glimpse of our journey so far.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <StatsCounter 
            icon={<FaUsers />}
            title="Happy Clients"
            value={500}
            color="primary"
            delay={0}
          />
          
          <StatsCounter 
            icon={<FaRing />}
            title="Wedding Events"
            value={300}
            color="secondary"
            delay={0.1}
          />
          
          <StatsCounter 
            icon={<FaBirthdayCake />}
            title="Birthday Events"
            value={250}
            color="accent"
            delay={0.2}
          />
          
          <StatsCounter 
            icon={<FaComments />}
            title="Positive Feedbacks"
            value={450}
            color="success"
            delay={0.3}
          />
        </motion.div>
      </div>
    </section>
  )
}

export default Stats