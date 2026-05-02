import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, Edit3, Plus, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { editEvent, getAllEvents, updateEventAdmin } from '../../features/admin/adminSlice'
import { toast } from 'react-toastify'
import LoadingScreen from '../../components/LoadingScreen'
import EditEventForm from './EditEventForm'   // ✅ import karo

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } }

export default function AdminEvents() {

  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)  // ✅ edit modal state
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    users = [],
    events = [],
    orders = [],
    adminLoading,
    adminErrorMessage,
    adminError
  } = useSelector(state => state.admin)

  const handleShowModal = () => {
    setShowModal(showModal ? false : true)
  }

  const handleEditEvent = (event) => {
    dispatch(editEvent(event))
    setShowEditModal(true)
  }

  const handleToggleActive = (ev) => {
    const formData = new FormData()
    // Convert boolean to string or just send boolean. FormData converts it to string "true"/"false"
    formData.append('isActive', !ev.isActive)
    dispatch(updateEventAdmin({ id: ev._id, formData }))
  }
  // Modal open hone par body scroll band karo
  useEffect(() => {
    if (showEditModal) {
      document.body.style.overflow = 'hidden'  // ✅ page scroll band
    } else {
      document.body.style.overflow = 'unset'   // ✅ modal close hone par wapas
    }

    // Cleanup — component unmount ho to reset karo
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showEditModal])

  useEffect(() => {
    dispatch(getAllEvents())
  }, [dispatch])

  useEffect(() => {
    if (adminError && adminErrorMessage) {
      toast.error(adminErrorMessage, { position: 'top-center', theme: "dark" })
    }
  }, [adminError, adminErrorMessage])

  if (adminLoading) return <LoadingScreen />

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-['Syne'] text-3xl font-bold text-white">Events</h1>
            <Link to="/admin/events/create">
              <motion.button
                className="flex items-center gap-2 rounded-full bg-[#C8F135] px-5 py-2 text-sm font-bold text-zinc-950"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <Plus className="h-4 w-4" /> Create Event
              </motion.button>
            </Link>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-zinc-700/50 bg-zinc-800/40 px-4 py-2">
              <Search className="h-4 w-4 text-zinc-500" />
              <input type="text" placeholder="Search events..." className="bg-transparent text-sm text-white outline-none placeholder:text-zinc-500" readOnly />
            </div>
            <button className="flex items-center gap-2 rounded-xl border border-zinc-700/50 px-4 py-2 text-sm text-zinc-400 hover:border-[#C8F135] hover:text-[#C8F135]">
              <SlidersHorizontal className="h-4 w-4" /> Filter
            </button>
          </div>
        </div>

        <motion.div
          className="overflow-hidden rounded-2xl border border-zinc-700/30 bg-zinc-800/40 backdrop-blur-2xl"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-700/30 text-zinc-500">
                  <th className="px-5 py-4 font-medium">Event</th>
                  <th className="px-5 py-4 font-medium">Artist</th>
                  <th className="px-5 py-4 font-medium">Date</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Active</th>
                  <th className="px-5 py-4 font-medium">Price</th>
                  <th className="px-5 py-4 font-medium">Seats</th>
                  <th className="px-5 py-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev._id} className="border-b border-zinc-800/50 transition-colors hover:bg-zinc-800/30">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={ev.eventImage} alt={ev.title} className="h-10 w-10 rounded-lg object-cover" loading="lazy" />
                        <span className="font-medium text-white">{ev.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-zinc-400">{ev.eventArtistName}</td>
                    <td className="px-5 py-4 text-zinc-400">{new Date(ev.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-[#C8F135]/10 px-3 py-1 text-xs font-bold text-[#C8F135]">{ev.status}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div 
                        onClick={() => handleToggleActive(ev)}
                        className={`h-5 w-10 rounded-full ${ev.isActive ? 'bg-[#C8F135]' : 'bg-zinc-600'} relative cursor-pointer transition-colors`}
                      >
                        <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${ev.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium text-white">₹{ev.ticketPrice.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-4 text-zinc-400">{ev.totalSeats}</td>
                    <td className="px-5 py-4">
                      {/* ✅ Link HATA diya, sirf button rakha */}
                      <button
                        onClick={() => handleEditEvent(ev)}
                        className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-[#C8F135]"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>

      {/* ✅ Edit Modal — bahar click se close, andar se nahi */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto overscroll-contain"  // ✅ overscroll-contain
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 z-10 rounded-full bg-zinc-800 border border-zinc-700 p-1.5 text-zinc-400 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>

            <EditEventForm onCancel={() => setShowEditModal(false)} />
          </div>
        </div>
      )}

    </>
  )
}