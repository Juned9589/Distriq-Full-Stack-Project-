// 
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Edit3, CreditCard, Calendar, Ticket, Mail, Phone, Plus, LayoutDashboard, ShieldCheck } from 'lucide-react'
import { TrashIcon } from "@heroicons/react/24/solid";
import { Button, ButtonGroup } from "@material-tailwind/react";
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { toast } from "react-toastify";
import { getTickets, ticketCancel } from '../features/orders/orderSlice'
import LoadingScreen from '../components/LoadingScreen';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }

export default function Profile() {
  const { orders, orderLoading, orderSuccess, orderError, orderErrorMessage } = useSelector(state => state.order)
  const { user } = useSelector(state => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {

    if (!orderError) {
      dispatch(getTickets())
    }
    if (!user) {
      navigate('/login')
    }
  }, [user])

  const confirmCancel = async () => {
    try {
      dispatch(ticketCancel(selectedOrder))


      toast.success("Ticket Cancelled Successfully 🎉");

      setOpen(false);
    } catch (error) {
      toast.error("Something went wrong ❌");
    }
  };



  //  Guard BEFORE using user properties
  if (!user) return null

  const initials = user.name?.split(' ').map(n => n[0]).join('') || '?'
  const confirmedTickets = (orders || []).filter(
    (t) => t && t.status === "confirm"
  );

  return (
    <motion.div
      className="min-h-screen bg-zinc-950 pb-20"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Cover Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-[#C8F135]/20 via-violet-500/10 to-zinc-900 md:h-56">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_80%,rgba(200,241,53,0.15),transparent)]" />
      </div>

      <div className="mx-auto max-w-4xl px-6">
        {/* Avatar + Name */}
        <div className="-mt-16 mb-8 flex flex-col items-center md:flex-row md:items-end md:gap-6">
          {/* ✅ Removed wrong img tag */}
          <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-zinc-950 bg-gradient-to-br from-[#C8F135]/30 to-[#C8F135]/10 font-['Syne'] text-4xl font-bold text-[#C8F135]">
            {initials}
          </div>
          <div className="mt-4 text-center md:mt-0 md:text-left">
            <h1 className="font-['Syne'] text-3xl font-bold text-white">{user.name}</h1>
            <p className="text-sm text-zinc-400">{user.email}</p>
            <p className="text-sm text-zinc-500">{user.phone || 'No phone added'}</p>
          </div>
          
          {/* Panel Switcher */}
          <div className="mt-6 flex flex-1 justify-center md:mt-0 md:justify-end">
            {user.isAdmin && (
              <Link to="/admin/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-xl bg-[#C8F135]/10 px-6 py-2.5 text-sm font-bold text-[#C8F135] border border-[#C8F135]/20 hover:bg-[#C8F135]/20 transition-all"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin Dashboard
                </motion.button>
              </Link>
            )}
            {!user.isAdmin && (
              <div className="flex items-center gap-2 rounded-xl bg-zinc-800/50 px-6 py-2.5 text-sm font-bold text-zinc-400 border border-zinc-700/50">
                <LayoutDashboard className="h-4 w-4" />
                User Dashboard
              </div>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <motion.div
          className="mb-8 grid grid-cols-3 gap-4"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="rounded-2xl border border-zinc-700/30 bg-zinc-800/40 p-5 text-center backdrop-blur-2xl">
            <CreditCard className="mx-auto mb-2 h-5 w-5 text-[#C8F135]" />
            <p className="font-['Syne'] text-2xl font-bold text-[#C8F135]">
              ₹{user.credits?.toLocaleString('en-IN') || '0'}
            </p>
            <p className="text-xs text-zinc-500">Credits</p>
          </div>
          <div className="rounded-2xl border border-zinc-700/30 bg-zinc-800/40 p-5 text-center backdrop-blur-2xl">
            <Ticket className="mx-auto mb-2 h-5 w-5 text-violet-400" />
            <p className="font-['Syne'] text-2xl font-bold text-white">{confirmedTickets.length}</p>
            <p className="text-xs text-zinc-500">Tickets Booked</p>
          </div>
          <div className="w-full rounded-2xl border border-zinc-700/30 bg-zinc-800/40 p-4 sm:p-5 text-center backdrop-blur-2xl">

            <Calendar className="mx-auto mb-2 h-5 w-5 sm:h-6 sm:w-6 text-zinc-400" />

            <p className="font-[''] text-sm sm:text-lg font-bold text-white break-words leading-">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-IN")
                : "N/A"}
            </p>

            <p className="text-[11px] sm:text-xs text-zinc-400">
              Member Since
            </p>

          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Info */}
          <motion.div
            className="rounded-3xl border border-zinc-700/30 bg-zinc-800/40 p-6 backdrop-blur-2xl"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-['Syne'] text-lg font-bold text-white">Profile Info</h3>
              <motion.button
                className="rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-700 hover:text-[#C8F135]"
                whileHover={{ scale: 1.1 }}
                aria-label="Edit profile"
              >
                <Edit3 className="h-4 w-4" />
              </motion.button>
            </div>
            <div className="space-y-4">
              {[
                { icon: Mail, label: 'Email', value: user.email || 'N/A' },
                { icon: Phone, label: 'Phone', value: user.phone || 'Not added' },
                { icon: Calendar, label: 'Joined', value: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-700/50">
                    <item.icon className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">{item.label}</p>
                    <p className="text-sm text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Credits / Wallet */}
          <motion.div
            className="rounded-3xl border border-[#C8F135]/20 bg-gradient-to-br from-[#C8F135]/10 to-zinc-800/40 p-6 backdrop-blur-2xl"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3 className="mb-2 font-['Syne'] text-lg font-bold text-white">Wallet</h3>
            <p className="mb-1 text-sm text-zinc-400">Available Balance</p>
            {/* ✅ user.credits instead of currentUser.credits */}
            <p className="mb-6 font-['Syne'] text-5xl font-bold text-[#C8F135]">
              ₹{user.credits?.toLocaleString('en-IN') || '0'}
            </p>
            <motion.button
              className="flex items-center gap-2 rounded-full bg-[#C8F135] px-6 py-3 font-bold text-zinc-950"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <Plus className="h-4 w-4" /> Add Credits
            </motion.button>
          </motion.div>
        </div>

        {/* Recent Tickets */}
        <motion.div
          className="mt-8"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-['Syne'] text-lg font-bold text-white">Recent Tickets</h3>
            <Link to="/my-tickets" className="text-sm text-[#C8F135] hover:underline">View All →</Link>
          </div>
          <div className="space-y-4">
            {orderLoading ? (
              <LoadingScreen />
            ) :
              (orders || [])
                .filter(Boolean)
                .slice(-2)
                .reverse()
                .map((order) => (
                  <div
                    key={order?._id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-zinc-700/30 bg-zinc-800/40 p-4 backdrop-blur-2xl hover:bg-zinc-800/60 transition-all"
                  >

                    {/* LEFT - Image + Info */}
                    <div className="flex items-center gap-4">
                      <img
                        src={order.event?.eventImage}
                        alt={order.event?.title}
                        className="h-16 w-16 rounded-xl object-cover"
                      />

                      <div>
                        <p className="font-semibold text-white text-sm sm:text-base">
                          {order?.event?.title}
                        </p>

                        <p className="text-xs text-zinc-400">
                          {order?.seats} seats •{" "}
                          {new Date(order?.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT SECTION */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">

                      {/* Status + Price */}
                      <div className="flex items-center justify-between sm:block text-right w-full sm:w-auto">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${order.status === "confirmed"
                            ? "bg-[#C8F135]/10 text-[#C8F135]"
                            : "bg-red-500/10 text-red-400"
                            }`}
                        >
                          {order?.status || "unknown"}
                        </span>

                        <p className="mt-1 text-sm sm:text-lg font-bold text-white">
                          ₹{order?.billedAmount?.toLocaleString("en-IN") || "0"}
                        </p>
                      </div>

                      {/* Cancel Button */}
                      {order?.status === "confirm" && (
                        <Button
                          onClick={() => {
                            setSelectedOrder(order._id);
                            setOpen(true);
                          }}
                          color="red"
                          size="sm"
                          className="flex items-center justify-center gap-2 rounded-full px-4 py-2 shadow-md hover:scale-105 hover:shadow-lg transition-all w-full sm:w-auto"
                        >
                          <TrashIcon className="h-4 w-4" />
                          Cancel
                        </Button>
                      )}

                    </div>
                  </div>
                ))}
          </div>
        </motion.div>

        <div className="p-4">
          {open && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">

              <div className="bg-zinc-900 p-6 rounded-xl w-[90%] max-w-sm text-center">

                <h2 className="text-lg font-semibold text-white mb-2">
                  Cancel Ticket?
                </h2>

                <p className="text-sm text-zinc-400 mb-4">
                  Are you sure you want to cancel this ticket?
                </p>

                <div className="flex gap-3 justify-center">

                  <button
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 rounded-lg bg-zinc-700 text-white"
                  >
                    No
                  </button>

                  <button
                    onClick={confirmCancel}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white"
                  >
                    Yes, Cancel
                  </button>

                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </motion.div>
  )
}