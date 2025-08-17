import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import connectDB from './config/db.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'

// Load env vars - must be before importing routes
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '../.env') })

// Verify required environment variables
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET environment variable is required')
  process.exit(1)
}

// Route imports
import authRoutes from './routes/authRoutes.js'
import inquiryRoutes from './routes/inquiryRoutes.js'
import feedbackRoutes from './routes/feedbackRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

// Connect to database
connectDB()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : 'http://localhost:5173',
  credentials: true
}))

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/inquiries', inquiryRoutes)
app.use('/api/feedbacks', feedbackRoutes)
app.use('/api/admin', adminRoutes)

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(join(__dirname, '../dist')))
  
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'))
  })
} else {
  // Basic route for API status
  app.get('/', (req, res) => {
    res.json({ message: 'API is running...' })
  })
}

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app