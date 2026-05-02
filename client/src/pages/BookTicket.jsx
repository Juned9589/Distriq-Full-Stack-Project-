
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Minus, Tag, Calendar, MapPin, User, Lock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { getSingleEvent } from '../features/event/eventSlice.js'
import LoadingScreen from '../components/LoadingScreen'
import { applyCoupon, bookTicket } from '../features/orders/orderSlice.js'
import BookingConfirmation from './BookingConfimation.jsx'

export default function BookTicket() {

  const { eid } = useParams()
  const { user } = useSelector(state => state.auth)
  const { event, eventLoading, eventError, eventErrorMessage } = useSelector(state => state.event)
  const { coupon, orderLoading, orderError, orderErrorMessage } = useSelector(state => state.order)
  const [ticketCount, setTicketCount] = useState(1)
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (eid) {
      dispatch(getSingleEvent(eid))
    }
  }, [eid, dispatch])


  useEffect(() => {
    if (eventError && eventErrorMessage) {
      toast.error(eventErrorMessage, { position: 'top-center', theme: 'dark' })
    }
    if (orderError && orderErrorMessage) {
      toast.error(orderErrorMessage, { position: 'top-center', theme: 'dark' })
    }
  }, [eventError, eventErrorMessage, orderError, orderErrorMessage])

  if (eventLoading || orderLoading) return <LoadingScreen />
  if (!event) return <p>No event found</p>

  const seats = ticketCount
  const subtotal = (event.ticketPrice || 0) * seats
  const discountRate = couponApplied ? (coupon?.couponDiscount || 0) : 0
  const discount = Math.round((subtotal * discountRate) / 100)
  const total = subtotal - discount

  const handleApplyCoupon = async (e) => {
    e.preventDefault()

    try {
      const res = await dispatch(applyCoupon({ couponCode })).unwrap()

      setCouponApplied(true)

      toast.success(`Coupon applied! ${res.couponDiscount}% off`, {
        position: 'top-center',
        theme: 'dark'
      })

    } catch (err) {
      setCouponApplied(false)

      toast.error(err, {
        position: 'top-center',
        theme: 'dark'
      })
    }
  }



  const handleTicketBooking = async () => {
    try {
      await dispatch(bookTicket({
        eventId: eid,
        numberOfSeats: ticketCount,
        couponCode: couponCode || null,
      })).unwrap()
      toast.success('Booking confirmed!', { position: 'top-center', theme: 'dark' })

      // navigate(`/auth/book/${eid}`)
      navigate(`/auth/book/${eid}`, {
        state: { ticketCount, coupon }
      })

    } catch (err) {
      toast.error(err, { position: 'top-center', theme: 'dark' })
    }
  }

  return (
    <motion.div
      className="min-h-screen bg-zinc-950 pt-28 pb-20"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <Link to={`/events/${event._id}`}>
          <motion.button
            className="mb-8 flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-[#C8F135]"
            whileHover={{ x: -4 }}
          >
            <ArrowLeft className="h-4 w-4" /> Back to Event
          </motion.button>
        </Link>

        <h1 className="mb-10 font-['Syne'] text-3xl font-bold text-white md:text-4xl">Book Your Ticket</h1>

        <div className="flex flex-col gap-8 lg:flex-row">

          <div className="flex-1 space-y-6">

            {/* Event Mini Header */}
            <div className="flex items-center gap-4 rounded-2xl border border-zinc-700/30 bg-zinc-800/40 p-4 backdrop-blur-2xl">
              <img
                src={event.eventImage}
                alt={event.title}
                className="h-20 w-20 rounded-xl object-cover"
                loading="lazy"
              />
              <div>
                <h3 className="font-['Syne'] text-lg font-bold text-white">{event.title}</h3>
                <p className="text-sm text-[#C8F135]">{event.eventArtistName}</p>
                <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {event.eventDate
                      ? new Date(event.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                      : 'N/A'}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {event.eventLocation}
                  </span>
                </div>
              </div>
            </div>

            {/* Seats Selector */}
            <div className="rounded-2xl border border-zinc-700/30 bg-zinc-800/40 p-6 backdrop-blur-2xl">
              <h4 className="mb-4 font-['Syne'] text-lg font-semibold text-white">Select Seats</h4>
              <div className="flex items-center gap-6">
                <motion.button
                  onClick={() => setTicketCount(prev => Math.max(1, prev - 1))}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-600 text-white transition-all hover:border-[#C8F135] hover:text-[#C8F135]"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Decrease seats"
                >
                  <Minus className="h-5 w-5" />
                </motion.button>

                <span className="font-['Syne'] text-4xl font-bold text-white">{ticketCount}</span>

                <motion.button
                  onClick={() => setTicketCount(prev => Math.min(5, prev + 1))}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-600 text-white transition-all hover:border-[#C8F135] hover:text-[#C8F135]"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Increase seats"
                >
                  <Plus className="h-5 w-5" />
                </motion.button>
                <span className="text-sm text-zinc-500">Max 5 seats</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="rounded-2xl border border-zinc-700/30 bg-zinc-800/40 p-6 backdrop-blur-2xl">
              <h4 className="mb-4 flex items-center gap-2 font-['Syne'] text-lg font-semibold text-white">
                <Tag className="h-5 w-5 text-[#C8F135]" /> Apply Coupon
              </h4>
              <form onSubmit={handleApplyCoupon} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className={couponApplied ? "flex-1 rounded-xl border border-zinc-700/50 bg-green-900 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-[#C8F135]" : "flex-1 rounded-xl border border-zinc-700/50 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-[#C8F135]"}
                  value={couponCode}
                  onChange={(e) => { setCouponCode(e.target.value); setCouponApplied(false) }}
                  disabled={couponApplied}
                />
                <motion.button
                  type='submit'
                  className="rounded-xl bg-[#C8F135] px-6 py-3 text-sm font-bold text-zinc-950 disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={couponApplied}
                >
                  Apply
                </motion.button>
              </form>
              {couponApplied && (
                <div className="flex items-center justify-between text-sm mt-3">
                  <span className="text-[#C8F135]">Discount ({coupon?.couponDiscount}%)</span>
                  <span className="text-[#C8F135]">-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            {/* Credits */}
            {user && (
              <div className="flex items-center justify-between rounded-2xl border border-zinc-700/30 bg-zinc-800/40 p-6 backdrop-blur-2xl">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-[#C8F135]" />
                  <span className="text-sm text-zinc-400">Your Credits</span>
                </div>
                <span className="font-['Syne'] text-2xl font-bold text-white">
                  ₹{user.credits?.toLocaleString('en-IN') || 0}
                </span>
              </div>
            )}

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded accent-[#C8F135]" />
              <span className="text-sm text-zinc-400">
                I agree to the <span className="text-[#C8F135]">Terms & Conditions</span> and <span className="text-[#C8F135]">Refund Policy</span>
              </span>
            </label>

            {/* Confirm */}
            <motion.button
              onClick={handleTicketBooking}
              type='button'
              className="w-full rounded-full bg-[#C8F135] py-4 font-bold text-zinc-950 text-lg transition-all duration-300"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Confirm Booking
            </motion.button>
          </div>

          {/* Right - Order Summary */}
          <div className="lg:w-96">
            <motion.div
              className="sticky top-28 rounded-3xl border border-zinc-700/30 bg-zinc-800/40 p-6 backdrop-blur-2xl"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="mb-6 font-['Syne'] text-xl font-bold text-white">Order Summary</h3>

              <div className="mb-6 space-y-3 border-b border-zinc-700/30 pb-6">
                <p className="font-medium text-white">{event.title}</p>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Calendar className="h-3.5 w-3.5" />
                  {event.eventDate
                    ? new Date(event.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                    : 'N/A'}
                </div>
                <p className="text-sm text-[#C8F135]">{event.eventArtistName}</p>
              </div>

              <div className="mb-6 space-y-3 border-b border-zinc-700/30 pb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">{seats} × ₹{(event.ticketPrice || 0).toLocaleString('en-IN')}</span>
                  <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {/* ✅ Fixed: dynamic discount % and amount using shared `discount` variable */}
                {couponApplied && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#C8F135]">Discount ({coupon?.couponDiscount}%)</span>
                    <span className="text-[#C8F135]">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              <div className="mb-6 flex items-center justify-between">
                <span className="font-['Syne'] text-lg font-bold text-white">Total</span>
                <span className="font-['Syne'] text-2xl font-bold text-white">₹{total.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900/60 py-3 text-xs text-zinc-500">
                <Lock className="h-3.5 w-3.5" />
                <span>Secure checkout • 256-bit SSL</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </motion.div>
  )
}
