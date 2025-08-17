import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Loading from './components/ui/Loading'
import PrivateRoute from './components/auth/PrivateRoute'
import './App.css'

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const InquiryPage = lazy(() => import('./pages/InquiryPage'))
const FeedbackPage = lazy(() => import('./pages/FeedbackPage'))
const AllFeedbacksPage = lazy(() => import('./pages/AllFeedbacks'))
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'))
const AdminRegister = lazy(() => import('./pages/admin/AdminRegister'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminInquiries = lazy(() => import('./pages/admin/ManageInquiries'))
const AdminFeedbacks = lazy(() => import('./pages/admin/ManageFeedbacks'))
const NotFoundPage = lazy(() => import('./pages/NotFound'))

function App() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/inquire" element={<InquiryPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/feedbacks" element={<AllFeedbacksPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/register" element={<AdminRegister />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<PrivateRoute />}>
              <Route index element={<AdminDashboard />} />
              <Route path="inquiries" element={<AdminInquiries />} />
              <Route path="feedbacks" element={<AdminFeedbacks />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

export default App