import { motion } from 'framer-motion'
import { Search, SlidersHorizontal } from 'lucide-react'
import EventCard from '../components/EventCard'
import LoadingScreen from '../components/LoadingScreen'
import { useDispatch, useSelector } from 'react-redux'

import { useEffect } from 'react'
import { getEvents } from '../features/event/eventSlice'

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const categories = ['All', 'Music', 'Art', 'Tech', 'Comedy', 'Film', 'Sports', 'Food']
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
// Add this near the top of Events.jsx (outside the component)
export default function Events() {

  const { events = [], eventLoading } = useSelector(state => state.event)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getEvents())
  }, [dispatch])

  if (eventLoading) {
    return <LoadingScreen />
  }

  return (
    <motion.div
      className="min-h-screen bg-zinc-950 pt-28 pb-20"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white">All Events</h1>

          <div className="mt-2 flex items-center gap-3">
            <span className="bg-[#C8F135]/10 px-3 py-1 text-sm text-[#C8F135] rounded-full">
              {events.length} events
            </span>
            <p className="text-sm text-zinc-500">Find your next experience</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex justify-between flex-wrap gap-4">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((cat, i) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm ${i === 0
                  ? 'bg-[#C8F135] text-black'
                  : 'border border-zinc-700 text-zinc-400'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <div className="flex items-center gap-2 border border-zinc-700 px-3 py-2 rounded-full">
              <Search className="w-4 h-4 text-zinc-400" />
              <input
                placeholder="Search..."
                className="bg-transparent outline-none text-white text-sm"
              />
            </div>

            <button className="border border-zinc-700 px-3 py-2 rounded-full text-sm text-zinc-400">
              <SlidersHorizontal className="w-4 h-4 inline" /> Sort
            </button>
          </div>
        </div>

        {/* Grid */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {events.map((event, i) => (
            <motion.div key={event?._id || i} variants={fadeUp}>
              <EventCard event={event} index={i} />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </motion.div>
  )
}