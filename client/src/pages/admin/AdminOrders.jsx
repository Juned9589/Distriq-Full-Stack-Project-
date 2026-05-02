import { motion } from 'framer-motion'

import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getAllOrders } from '../../features/admin/adminSlice'
import { toast } from 'react-toastify'
import LoadingScreen from '../../components/LoadingScreen'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } }

const statusColors = {
  confirmed: 'bg-[#C8F135]/10 text-[#C8F135]',
  cancelled: 'bg-red-500/10 text-red-400',
  pending: 'bg-yellow-500/10 text-yellow-400',
}

export default function AdminOrders() {

  const {
    users = [],
    events = [],
    orders = [],
    adminLoading,
    adminErrorMessage,
    adminError
  } = useSelector(state => state.admin)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllOrders())
  }, [dispatch])


  useEffect(() => {
    if (adminError && adminErrorMessage) {
      toast.error(adminErrorMessage, { position: 'top-center', theme: "dark" })
    }
  }, [adminError, adminErrorMessage])

  if (adminLoading) return <LoadingScreen />
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="mb-8">
        <h1 className="font-['Syne'] text-3xl font-bold text-white">Orders</h1>
        <p className="mt-1 text-sm text-zinc-500">{orders.length} total orders</p>
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
                <th className="px-5 py-4 font-medium">Order ID</th>
                <th className="px-5 py-4 font-medium">User</th>
                <th className="px-5 py-4 font-medium">Event</th>
                <th className="px-5 py-4 font-medium">Seats</th>
                <th className="px-5 py-4 font-medium">Amount</th>
                <th className="px-5 py-4 font-medium">Discount</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-zinc-800/50 transition-colors hover:bg-zinc-800/30">
                  <td className="px-5 py-4 font-mono text-xs text-zinc-400">{order._id}</td>
                  <td className="px-5 py-4 text-white">{order.user.name}</td>
                  <td className="px-5 py-4 text-zinc-300">{order.event.title}</td>
                  <td className="px-5 py-4 text-zinc-400">{order.seats}</td>
                  <td className="px-5 py-4 font-medium text-white">₹{order.billedAmount.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4">
                    {order.isDiscounted ? (
                      <span className="rounded-full bg-[#C8F135]/10 px-3 py-1 text-xs font-bold text-[#C8F135]">Yes</span>
                    ) : (
                      <span className="text-xs text-zinc-500">No</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusColors[order.status] || 'bg-zinc-700/50 text-zinc-400'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-zinc-400">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}
