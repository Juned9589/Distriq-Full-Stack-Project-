import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock } from 'lucide-react'

export default function EventCard({ event, index = 0 }) {

  if (!event) return null

  const seatsLeft = Math.floor((event?.totalSeats || 0) * 0.3)

  const statusColors = {
    upcoming: 'bg-[#C8F135] text-zinc-950',
    ongoing: 'bg-violet-500 text-white',
    cancelled: 'bg-red-500 text-white',
  }

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group overflow-hidden rounded-3xl border border-zinc-700/30 bg-zinc-800/40 backdrop-blur-2xl transition-shadow duration-300 hover:shadow-[0_20px_60px_rgba(200,241,53,0.15)]"
    >
      <Link to={`/events/${event._id}`}>
        <div className="relative aspect-video overflow-hidden">
          <img
            src={event.eventImage}
            alt={event.title || 'Event'}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent" />
          <span className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-bold uppercase ${statusColors[event.status] || 'bg-zinc-700 text-white'}`}>
            {event.status || 'N/A'}
          </span>
          <span className="absolute top-4 right-4 rounded-full bg-zinc-900/80 px-3 py-1 text-xs font-medium text-zinc-300 backdrop-blur-md">
            {event.duration || 'N/A'}
          </span>
        </div>

        <div className="p-5">
          <p className="mb-1 text-xs font-semibold tracking-wider text-[#C8F135] uppercase">{event.eventArtistName || 'Unknown Artist'}</p>
          <h3 className="mb-3 line-clamp-2 font-['Syne'] text-lg font-bold text-white">{event.title || 'Untitled Event'}</h3>

          <div className="mb-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Calendar className="h-3.5 w-3.5 text-zinc-500" />
              <span>
                {event.eventDate
                  ? new Date(event.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                  : 'TBA'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <MapPin className="h-3.5 w-3.5 text-zinc-500" />
              <span className="truncate">{event.eventLocation || 'Location TBA'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Clock className="h-3.5 w-3.5 text-zinc-500" />
              <span>{event.duration || 'N/A'}</span>
            </div>
          </div>

          <div className="mb-4 flex items-end justify-between">
            <p className="font-['Syne'] text-2xl font-bold text-white">
              ₹{event.ticketPrice?.toLocaleString('en-IN') || '0'}
            </p>
          </div>

          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between text-xs text-zinc-500">
              <span>{seatsLeft} seats left</span>
              <span>{event.totalSeats || 0} total</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-700/50">
              <div className="h-full w-[30%] rounded-full bg-[#C8F135]" role="progressbar" />
            </div>
          </div>

          <motion.div
            className="w-full rounded-full bg-[#C8F135] py-3 text-center text-sm font-bold text-zinc-950 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            Book Now
          </motion.div>
        </div>
      </Link>
    </motion.div>
  )
}