import { motion } from 'framer-motion'
import TicketCard from '../components/TicketCard'

import LoadingScreen from '../components/LoadingScreen'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { getTickets } from '../features/orders/orderSlice'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }

const tabs = ['All', 'Confirmed', 'Cancelled']

export default function MyTickets() {

  const { orders, orderLoading, orderSuccess, orderError, orderErrorMessage } = useSelector(state => state.order)
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('All')

  useEffect(() => {
    if (!user) {
      navigate("/login")
    }
    dispatch(getTickets())


  }, [user])

  useEffect(() => {

    if (orderError && orderErrorMessage) {
      toast.error(orderErrorMessage, { position: "top-center", theme: "dark" })
    }
  }, [orderError, orderErrorMessage,])

  if (orderLoading) {
    return (
      <LoadingScreen text={"Loading Tickets"} />
    )
  }

  const sortedOrders = [...(orders || [])]
    .filter(ticket => {
      if (activeTab === 'All') return true;
      if (activeTab === 'Confirmed') return ticket.status === 'confirm';
      if (activeTab === 'Cancelled') return ticket.status === 'cancelled';
      return true;
    })
    .sort((a, b) => {
      if (a.status === 'confirm' && b.status !== 'confirm') return -1;
      if (a.status !== 'confirm' && b.status === 'confirm') return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <motion.div
      className="min-h-screen bg-zinc-950 pt-28 pb-20"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-8 flex items-center gap-4">
          <h1 className="font-['Syne'] text-4xl font-bold text-white">My Tickets</h1>
          <span className="rounded-full bg-[#C8F135]/10 px-3 py-1 text-sm font-semibold text-[#C8F135]">{orders?.length || 0}</span>
        </div>

        <div className="mb-8 flex gap-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${activeTab === tab ? 'bg-[#C8F135] text-zinc-950' : 'border border-zinc-700/50 text-zinc-400 hover:border-[#C8F135] hover:text-[#C8F135]'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        <motion.div
          className="space-y-6"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {sortedOrders.map((ticket, i) => (
            <motion.div key={ticket._id} variants={fadeUp}>
              <TicketCard ticket={ticket} index={i} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}
