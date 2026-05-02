import { motion } from 'framer-motion'
import { Plus, Edit3, X, Check } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { couponCreate, getAllCoupons, updateCouponAdmin } from '../../features/admin/adminSlice'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import LoadingScreen from '../../components/LoadingScreen'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } }

export default function AdminCoupons() {
  const [formData, setFormData] = useState({ couponCode: '', couponDiscount: '' })
  const [showModal, setShowModal] = useState(false)
  const [editCoupon, setEditCoupon] = useState(null)
  const [editForm, setEditForm] = useState({ couponCode: '', couponDiscount: '' })
  const dispatch = useDispatch()

  const {
    coupons = [],
    adminLoading,
    adminErrorMessage,
    adminError
  } = useSelector(state => state.admin)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })
  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(couponCreate(formData)).unwrap()
      toast.success('Coupon Created Successfully 🎉', { position: 'top-center', theme: 'dark' })
      setFormData({ couponCode: '', couponDiscount: '' })
      setShowModal(false)
      dispatch(getAllCoupons())
    } catch (error) {
      toast.error(error || 'Something went wrong ❌', { position: 'top-center', theme: 'dark' })
    }
  }

  const handleEditSave = async () => {
    try {
      await dispatch(updateCouponAdmin({ id: editCoupon._id, couponData: editForm })).unwrap()
      toast.success('Coupon Updated ✅', { theme: 'dark' })
      setEditCoupon(null)
    } catch (err) {
      toast.error(err || 'Update failed', { theme: 'dark' })
    }
  }

  const handleToggle = async (coupon) => {
    try {
      await dispatch(updateCouponAdmin({ id: coupon._id, couponData: { isActive: !coupon.isActive } })).unwrap()
      toast.success(`Coupon ${!coupon.isActive ? 'activated' : 'deactivated'}`, { theme: 'dark' })
    } catch (err) {
      toast.error(err || 'Toggle failed', { theme: 'dark' })
    }
  }

  useEffect(() => {
    dispatch(getAllCoupons())
  }, [dispatch])

  useEffect(() => {
    if (adminError && adminErrorMessage) {
      toast.error(adminErrorMessage, { position: 'top-center', theme: 'dark' })
    }
  }, [adminError, adminErrorMessage])

  if (adminLoading) return <LoadingScreen />

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-['Syne'] text-3xl font-bold text-white">Coupons</h1>
          <p className="mt-1 text-sm text-zinc-500">{coupons.length} coupons</p>
        </div>
        <motion.button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-full bg-[#C8F135] px-6 py-2.5 text-sm font-bold text-zinc-950"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <Plus className="h-4 w-4" /> Create Coupon
        </motion.button>
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
                <th className="px-5 py-4 font-medium">Coupon Code</th>
                <th className="px-5 py-4 font-medium">Discount</th>
                <th className="px-5 py-4 font-medium">Active</th>
                <th className="px-5 py-4 font-medium">Created</th>
                <th className="px-5 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="border-b border-zinc-800/50 transition-colors hover:bg-zinc-800/30">
                  <td className="px-5 py-4">
                    <span className="rounded-lg bg-zinc-700/50 px-3 py-1.5 font-mono text-sm font-bold text-[#C8F135]">
                      {coupon.couponCode}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-['Syne'] text-lg font-bold text-white">{coupon.couponDiscount}%</td>
                  <td className="px-5 py-4">
                    <div
                      onClick={() => handleToggle(coupon)}
                      className={`h-5 w-10 rounded-full ${coupon.isActive ? 'bg-[#C8F135]' : 'bg-zinc-600'} relative cursor-pointer transition-colors`}
                    >
                      <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${coupon.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                  </td>
                  <td className="px-5 py-4 text-zinc-400">{new Date(coupon.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => { setEditCoupon(coupon); setEditForm({ couponCode: coupon.couponCode, couponDiscount: coupon.couponDiscount }) }}
                      className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-[#C8F135]"
                      aria-label="Edit coupon"
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

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Create Coupon</h2>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="couponCode"
                value={formData.couponCode}
                onChange={handleChange}
                type="text"
                placeholder="Coupon Code (e.g. SAVE20)"
                required
                className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm outline-none focus:border-[#C8F135]/70"
              />
              <input
                name="couponDiscount"
                value={formData.couponDiscount}
                onChange={handleChange}
                type="number"
                placeholder="Discount % (e.g. 20)"
                required
                className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm outline-none focus:border-[#C8F135]/70"
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-full border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-800">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#C8F135] text-black rounded-full font-bold text-sm">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editCoupon && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Edit Coupon</h2>
              <button onClick={() => setEditCoupon(null)} className="text-zinc-500 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-4">
              <input
                name="couponCode"
                value={editForm.couponCode}
                onChange={handleEditChange}
                type="text"
                placeholder="Coupon Code"
                className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm outline-none focus:border-[#C8F135]/70"
              />
              <input
                name="couponDiscount"
                value={editForm.couponDiscount}
                onChange={handleEditChange}
                type="number"
                placeholder="Discount %"
                className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm outline-none focus:border-[#C8F135]/70"
              />
              <div className="flex gap-3">
                <button onClick={() => setEditCoupon(null)} className="flex-1 py-2.5 rounded-full border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-800">Cancel</button>
                <button onClick={handleEditSave} className="flex-1 py-2.5 bg-[#C8F135] text-black rounded-full font-bold text-sm flex items-center justify-center gap-2">
                  <Check className="h-4 w-4" /> Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
