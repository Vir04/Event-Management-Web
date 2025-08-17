import { motion } from 'framer-motion'

const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <motion.div 
        className="w-16 h-16 border-4 border-primary-300 border-t-primary-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1.2, 
          ease: "linear", 
          repeat: Infinity 
        }}
      />
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  )
}

export default Loading