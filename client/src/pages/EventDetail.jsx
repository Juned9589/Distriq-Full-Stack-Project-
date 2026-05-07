
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, MapPin, Clock, Users, Heart, Star, Ticket, LogIn } from 'lucide-react'
import { getEventComment, getSingleEvent } from '../features/event/eventSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import LoadingScreen from '../components/LoadingScreen'
import { toast } from 'react-toastify'

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }

export default function EventDetail() {
  const { eid } = useParams()
  const { user } = useSelector(state => state.auth)
  const isLoggedIn = !!user
  const { event, eventComments, eventLoading, eventError, eventErrorMessage } = useSelector(state => state.event)
  const dispatch = useDispatch()


  useEffect(() => {
    if (!eventError && !eventErrorMessage) {
      //Fetch Event
      dispatch(getSingleEvent(eid))
      dispatch(getEventComment(eid))

    }
  }, [dispatch, eventError, eventErrorMessage])


  useEffect(() => {
    if (eventError && eventErrorMessage) {
      toast.error(eventErrorMessage, { position: "top-center", theme: "dark" })
    }
  }, [eventError, eventErrorMessage])

  if (eventLoading) return <LoadingScreen />

  if (!event) return null


  const eventComment = Array.isArray(event?.comments)
    ? event.comments.filter(c => c?.event?._id === event._id || c?.event === event._id)
    : []

  const seatsLeft = event?.availableSeats || 0

  return (
    <motion.div
      className="min-h-screen bg-zinc-950"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Hero Banner */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img
          src={event?.eventImage}
          alt={event?.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        <div className="absolute top-24 left-6 z-10">
          <Link to="/events">
            <motion.button
              className="flex items-center gap-2 rounded-full border border-zinc-600 bg-zinc-900/80 px-4 py-2 text-sm text-white backdrop-blur-lg transition-all duration-300 hover:border-[#C8F135] hover:text-[#C8F135]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <ArrowLeft className="h-4 w-4" /> Back to Events
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 -mt-32 relative z-10 pb-20">
        <div className="flex flex-col gap-8 lg:flex-row">

          {/* Left - Details */}
          <div className="flex-1">
            <motion.div variants={fadeUp} initial="hidden" animate="visible">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#C8F135] px-4 py-1.5 text-xs font-bold uppercase text-zinc-950">
                  {event?.status}
                </span>
                <span className="rounded-full bg-zinc-800 px-4 py-1.5 text-xs font-medium text-zinc-300">
                  {event?.duration}
                </span>
              </div>

              <h1 className="mb-4 font-['Syne'] text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                {event?.title}
              </h1>

              <div className="mb-6 flex items-center gap-2 rounded-full bg-[#C8F135]/10 px-4 py-2 w-fit">
                <Ticket className="h-4 w-4 text-[#C8F135]" />
                <span className="text-sm font-semibold text-[#C8F135]">{event?.eventArtistName}</span>
              </div>

              <p className="mb-8 text-lg leading-relaxed text-zinc-400">
                {event?.description}
              </p>

              {/* Details Grid */}
              <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { icon: Calendar, label: 'Date', value: new Date(event?.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
                  { icon: MapPin, label: 'Location', value: event?.eventLocation },
                  { icon: Clock, label: 'Duration', value: event?.duration },
                  { icon: Users, label: 'Capacity', value: `${event?.totalSeats} seats` },
                ].map((d) => (
                  <div key={d.label} className="rounded-2xl border border-zinc-700/30 bg-zinc-800/40 p-4 backdrop-blur-2xl">
                    <d.icon className="mb-2 h-5 w-5 text-[#C8F135]" />
                    <p className="text-xs text-zinc-500">{d.label}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{d.value}</p>
                  </div>
                ))}
              </div>

              {/* Reviews */}
              <div>
                <h3 className="mb-6 font-['Syne'] text-2xl font-bold text-white">Reviews</h3>
                {/* ✅ Fix 7: use eventComments not event.comment */}
                {eventComments.length > 0 ? (
                  <div className="space-y-4">
                    {eventComments.map((c) => {
                      // ✅ Fix 8: safe initials
                      const initials = c?.user?.name
                        ? c.user.name.split(' ').map(n => n[0]).join('')
                        : '?'
                      return (
                        <motion.div
                          key={c._id}
                          className="rounded-2xl border border-zinc-700/30 bg-zinc-800/40 p-5 backdrop-blur-2xl"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4 }}
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C8F135]/20 text-xs font-bold text-[#C8F135]">
                                {initials}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">{c?.user?.name}</p>
                                <p className="text-xs text-zinc-500">{new Date(c?.createdAt).toLocaleDateString('en-IN')}</p>
                              </div>
                            </div>
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`h-3.5 w-3.5 ${i < c?.rating ? 'fill-[#C8F135] text-[#C8F135]' : 'text-zinc-600'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-zinc-400">{c?.text}</p>
                        </motion.div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500">No reviews yet for this event.</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right - Booking Card */}
          <div className="lg:w-96">
            <motion.div
              className="sticky top-28 rounded-3xl border border-zinc-700/30 bg-zinc-800/40 p-6 backdrop-blur-2xl"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="mb-1 text-sm text-zinc-500">Price per ticket</p>
              <p className="mb-6 font-['Syne'] text-4xl font-bold text-white">
                ₹{event?.ticketPrice?.toLocaleString('en-IN')}
              </p>

              <div className="mb-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Date</span>
                  <span className="font-medium text-white">
                    {new Date(event?.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Available Seats</span>
                  <span className={`font-medium ${seatsLeft < 10 ? 'text-red-500' : 'text-[#C8F135]'}`}>{seatsLeft} left</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Status</span>
                  <span className="font-medium text-white capitalize">{event?.status}</span>
                </div>
              </div>

              {isLoggedIn ? (
                <>
                  <Link to={`/events/${event?._id}/book`}>
                    <motion.button
                      className="mb-3 w-full rounded-full bg-[#C8F135] py-3.5 font-bold text-zinc-950 transition-all duration-300"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Book Ticket
                    </motion.button>
                  </Link>
                  <motion.button
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-zinc-600 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-[#C8F135] hover:text-[#C8F135]"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Heart className="h-4 w-4" /> Wishlist
                  </motion.button>
                </>
              ) : (
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
                  <LogIn className="mx-auto mb-2 h-6 w-6 text-amber-400" />
                  <p className="mb-1 text-sm font-semibold text-white">Login Required</p>
                  <p className="mb-4 text-xs text-zinc-400">Please login to book tickets or add to wishlist.</p>
                  <div className="flex gap-3">
                    <Link to="/login" className="flex-1">
                      <motion.button
                        className="w-full rounded-full bg-[#C8F135] py-2.5 text-sm font-bold text-zinc-950"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Login
                      </motion.button>
                    </Link>
                    <Link to="/register" className="flex-1">
                      <motion.button
                        className="w-full rounded-full border border-zinc-600 py-2.5 text-sm font-semibold text-white hover:border-[#C8F135] hover:text-[#C8F135]"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Register
                      </motion.button>
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </div>
    </motion.div>
  )
}