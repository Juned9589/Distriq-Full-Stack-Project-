
import { motion } from 'framer-motion'
import { Users, Calendar, ShoppingBag, Activity, Clock, TrendingUp } from 'lucide-react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllEvents, getAllOrders, getAllUsers } from '../../features/admin/adminSlice.js'
import { toast } from 'react-toastify'
import LoadingScreen from '../../components/LoadingScreen.jsx'

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function AdminDashboard() {

  const {
    users = [],
    events = [],
    orders = [],
    adminLoading,
    adminErrorMessage,
    adminError
  } = useSelector(state => state.admin)

  const dispatch = useDispatch()

  const totalUsers = users.length
  const totalEvents = events.length
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, o) => sum + (o?.billedAmount || 0), 0)
  const activeEvents = events.filter(e => e?.isActive).length
  const pendingEvents = events.filter(e => !e?.isActive).length

  const stats = [
    { icon: Users, label: 'Total Users', value: totalUsers, trend: '+12%' },
    { icon: Calendar, label: 'Total Events', value: totalEvents, trend: '+8%' },
    { icon: ShoppingBag, label: 'Total Orders', value: totalOrders, trend: '+24%' },
    { icon: Activity, label: 'Active Events', value: activeEvents },
    { icon: Clock, label: 'Pending Events', value: pendingEvents },
  ]


  useEffect(() => {
    dispatch(getAllUsers())
    dispatch(getAllEvents())
    dispatch(getAllOrders())
  }, [dispatch])


  useEffect(() => {
    if (adminError && adminErrorMessage) {
      toast.error(adminErrorMessage, { position: 'top-center', theme: "dark" })
    }
  }, [adminError, adminErrorMessage])

  if (adminLoading) return <LoadingScreen />

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      <h1 className="font-['Syne'] text-3xl font-bold text-white mb-6">Dashboard</h1>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={fadeUp}
            className="p-5 rounded-2xl bg-zinc-800/40 border border-zinc-700/30">

            <div className="flex justify-between mb-3">
              <s.icon className="h-5 w-5 text-green-400" />
              <span className="text-green-400 text-xs flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> {s.trend || ''}
              </span>
            </div>

            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-zinc-500">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Orders Table */}
      <div className="bg-zinc-800/40 p-6 rounded-2xl border border-zinc-700/30">
        <h3 className="font-['Syne'] text-xl font-bold text-white mb-4">Recent Orders</h3>

        {orders.length === 0 ? (
          <p className="text-zinc-400">No orders found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="text-zinc-500 border-b border-zinc-700/30">
                <th>Order ID</th>
                <th>User</th>
                <th>Event</th>
                <th>Seats</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-zinc-700/30">
                  <td className="py-3 px-4">{order._id}</td>
                  <td className="py-3 px-4">{order.user?.name || "N/A"}</td>
                  <td className="py-3 px-4">{order.event?.title || "N/A"}</td>
                  <td className="py-3 px-4">{order.seats}</td>
                  <td className="py-3 px-4">₹{order.billedAmount}</td>
                  <td className="py-3 px-4">{order.status}</td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Events */}
      <div className="mt-8">
        <h3 className="font-['Syne'] text-xl font-bold text-white mb-4">Recent Events</h3>

        <div className="grid gap-4 sm:grid-cols-3">
          {events.slice(0, 3).map((ev) => (
            <div key={ev._id} className="rounded-2xl bg-zinc-800/40 p-4">
              <p className="text-white">{ev.title}</p>
              <p className="text-zinc-400 text-sm">
                {new Date(ev.eventDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  )
}
