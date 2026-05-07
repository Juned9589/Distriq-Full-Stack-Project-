import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatWidget from './components/ChatWidget'
import LoadingScreen from './components/LoadingScreen'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import Home from './pages/Home'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import BookTicket from './pages/BookTicket'
import MyTickets from './pages/MyTickets'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import BookingConfirmation from './pages/BookingConfirmation'
import AiChat from './pages/AiChat'

import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminEvents from './pages/admin/AdminEvents'
import AdminUsers from './pages/admin/AdminUsers'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCoupons from './pages/admin/AdminCoupons'
import AdminRatings from './pages/admin/AdminRatings'
import { ToastContainer } from 'react-toastify'
import CreateEvent from './pages/admin/AdminCreateEvent'

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen key="loader" />}
      </AnimatePresence>

      {!loading && (
        <>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:eid" element={<EventDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected User Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/events/:eid/book" element={<BookTicket />} />
                <Route path="/my-tickets" element={<MyTickets />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/auth/book/:eid" element={<BookingConfirmation />} />
                <Route path="/ai-chat" element={<AiChat />} />
              </Route>

              {/* Protected Admin Routes */}
              <Route path="/admin/*" element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="events" element={<AdminEvents />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="coupons" element={<AdminCoupons />} />
                  <Route path="ratings" element={<AdminRatings />} />
                  <Route path="events/create" element={<CreateEvent />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <ChatWidget />
          <ToastContainer />
        </>
      )}
    </>
  )
}

