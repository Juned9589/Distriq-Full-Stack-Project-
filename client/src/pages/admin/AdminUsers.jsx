import { motion } from 'framer-motion'
import { Edit3, X, Check } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers, updateUserAdmin } from '../../features/admin/adminSlice'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import LoadingScreen from '../../components/LoadingScreen'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } }

export default function AdminUsers() {
  const {
    users = [],
    adminLoading,
    adminErrorMessage,
    adminError
  } = useSelector(state => state.admin)

  const dispatch = useDispatch()
  const [editUser, setEditUser] = useState(null)
  const [creditInput, setCreditInput] = useState('')

  useEffect(() => {
    dispatch(getAllUsers())
  }, [dispatch])

  useEffect(() => {
    if (adminError && adminErrorMessage) {
      toast.error(adminErrorMessage, { position: 'top-center', theme: 'dark' })
    }
  }, [adminError, adminErrorMessage])

  const handleToggleActive = async (user) => {
    try {
      await dispatch(updateUserAdmin({ id: user?._id, userData: { isActive: !user?.isActive } })).unwrap()
      toast.success(`User ${!user?.isActive ? 'activated' : 'deactivated'}`, { theme: 'dark' })
    } catch (err) {
      toast.error(err || 'Failed to update user', { theme: 'dark' })
    }
  }

  // const handleCreditSave = async () => {
  //   const amount = parseInt(creditInput)
  //   if (!creditInput || isNaN(amount)) {
  //     toast.error('Enter a valid number (e.g. 500 or -200)', { theme: 'dark' })
  //     return
  //   }
  //   try {
  //     await dispatch(updateUserAdmin({ id: editUser._id, userData: { credits: amount } })).unwrap()
  //     toast.success(`Credits updated for ${editUser.name}`, { theme: 'dark' })
  //     setEditUser(null)
  //     setCreditInput('')
  //   } catch (err) {
  //     toast.error(err || 'Failed to update credits', { theme: 'dark' })
  //   }
  // }

  const handleCreditSave = async () => {
    const amount = parseInt(creditInput)
    if (!creditInput || isNaN(amount)) {
      toast.error('Enter a valid number (e.g. 500 or -200)', { theme: 'dark' })
      return
    }
    try {
      await dispatch(updateUserAdmin({
        id: editUser._id,
        userData: { credits: amount }
      })).unwrap()

      toast.success(`Credits updated for ${editUser.name}`, { theme: 'dark' })
      setEditUser(null)
      setCreditInput('')

      //  Re-fetch users to sync UI with server state
      dispatch(getAllUsers())

    } catch (err) {
      toast.error(err || 'Failed to update credits', { theme: 'dark' })
    }
  }

  if (adminLoading) return <LoadingScreen />

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="mb-8">
        <h1 className="font-['Syne'] text-3xl font-bold text-white">Users</h1>
        <p className="mt-1 text-sm text-zinc-500">{users.length} registered users</p>
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
                <th className="px-5 py-4 font-medium">User</th>
                <th className="px-5 py-4 font-medium">Email</th>
                <th className="px-5 py-4 font-medium">Phone</th>
                <th className="px-5 py-4 font-medium">Credits</th>
                <th className="px-5 py-4 font-medium">Active</th>
                <th className="px-5 py-4 font-medium">Role</th>
                <th className="px-5 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const initials = user?.name?.split(' ').map(n => n[0]).join('') || '?'
                return (
                  <tr key={user?._id} className="border-b border-zinc-800/50 transition-colors hover:bg-zinc-800/30">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C8F135]/20 text-xs font-bold text-[#C8F135]">
                          {initials}
                        </div>
                        <span className="font-medium text-white">{user?.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-zinc-400">{user?.email}</td>
                    <td className="px-5 py-4 text-zinc-400">{user?.phone}</td>
                    <td className="px-5 py-4 font-medium text-[#C8F135]">₹{user?.credits?.toLocaleString('en-IN') || 0}</td>
                    <td className="px-5 py-4">
                      <div
                        onClick={() => handleToggleActive(user)}
                        className={`h-5 w-10 rounded-full ${user?.isActive ? 'bg-[#C8F135]' : 'bg-zinc-600'} relative cursor-pointer transition-colors`}
                      >
                        <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${user?.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {user?.isAdmin ? (
                        <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-400">Admin</span>
                      ) : (
                        <span className="rounded-full bg-zinc-700/50 px-3 py-1 text-xs font-medium text-zinc-400">User</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => { setEditUser(user); setCreditInput('') }}
                        className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-[#C8F135]"
                        aria-label="Edit credits"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Edit Credits Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-900 border border-zinc-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Edit Credits — {editUser?.name}</h2>
              <button onClick={() => setEditUser(null)} className="text-zinc-500 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-zinc-400 mb-1">Current: <span className="text-[#C8F135] font-bold">₹{editUser?.credits?.toLocaleString('en-IN') || 0}</span></p>
            <p className="text-xs text-zinc-500 mb-4">Enter positive to add, negative to subtract (e.g. 500 or -200)</p>
            <input
              type="number"
              value={creditInput}
              onChange={(e) => setCreditInput(e?.target?.value)}
              placeholder="e.g. 500 or -200"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#C8F135]/70 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setEditUser(null)}
                className="flex-1 py-2.5 rounded-full border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreditSave}
                className="flex-1 py-2.5 rounded-full bg-[#C8F135] text-black text-sm font-bold flex items-center justify-center gap-2"
              >
                <Check className="h-4 w-4" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
