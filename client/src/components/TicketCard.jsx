import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, QrCode } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TicketCard({ ticket, index = 0 }) {
  const { event } = ticket
  const isConfirmed = ticket.status === 'confirmed'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-zinc-700/30 bg-zinc-800/40 backdrop-blur-2xl lg:flex-row"
    >
      <div className="relative h-48 w-full shrink-0 overflow-hidden lg:h-auto lg:w-56">
        <img
          src={event.eventImage}
          alt={event.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-800/40 lg:bg-gradient-to-r" />
      </div>

      <div className="hidden items-center lg:flex">
        <div className="h-5/6 border-l border-dashed border-zinc-600/50" />
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 p-5 lg:flex-row lg:items-center lg:p-6">
        <div className="flex-1">
          <Link to={`/events/order.event._id`}>
            <h3 className="mb-1 font-['Syne'] text-xl font-bold text-white">{event.title}</h3>
          </Link>
          <p className="mb-3 text-sm font-medium text-[#C8F135]">{event.eventArtistName}</p>

          <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(event.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {event.eventLocation}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {ticket.seats} {ticket.seats > 1 ? 'seats' : 'seat'}
            </span>
          </div>
        </div>

        <div className="hidden items-center lg:flex">
          <div className="h-16 border-l border-dashed border-zinc-600/50" />
        </div>

        <div className="flex flex-row items-center gap-4 lg:flex-col lg:items-end lg:gap-3">
          <span className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase ${isConfirmed ? 'bg-[#C8F135]/10 text-[#C8F135]' : 'bg-red-500/10 text-red-400'}`}>
            {ticket.status}
          </span>
          <p className="font-['Syne'] text-2xl font-bold text-white">₹{ticket.billedAmount.toLocaleString('en-IN')}</p>
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-zinc-700/50 bg-zinc-800/60">
            <QrCode className="h-8 w-8 text-zinc-500" />
          </div>
          {isConfirmed && (
            <motion.button
              className="rounded-full border border-zinc-600 px-4 py-2 text-xs font-semibold text-zinc-400 transition-all duration-300 hover:border-red-500 hover:text-red-400"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Cancel Ticket
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
