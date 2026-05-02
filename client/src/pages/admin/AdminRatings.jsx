import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
// Note: Backend getAllRatings is a placeholder — using comments array as ratings data instead
// import { comments } from '../../data/mockData'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getAllRatings } from '../../features/admin/adminSlice'
import LoadingScreen from '../../components/LoadingScreen'
import { toast } from 'react-toastify'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } }

export default function AdminRatings() {

  const {
    users = [],
    events = [],
    orders = [],
    ratings = [],
    adminLoading,
    adminErrorMessage,
    adminError
  } = useSelector(state => state.admin)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllRatings())
  }, [dispatch])


  useEffect(() => {
    if (adminError && adminErrorMessage) {
      toast.error(adminErrorMessage, { position: 'top-center', theme: "dark" })
    }
  }, [adminError, adminErrorMessage])

  if (adminLoading) return <LoadingScreen />

  const avgRating = ratings.length
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="mb-8">
        <h1 className="font-['Syne'] text-3xl font-bold text-white">Ratings & Reviews</h1>
        <p className="mt-1 text-sm text-zinc-500">{ratings.length} reviews</p>
      </div>

      {/* Average Rating Card */}
      <motion.div
        className="mb-8 flex items-center gap-6 rounded-2xl border border-zinc-700/30 bg-zinc-800/40 p-6 backdrop-blur-2xl"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#C8F135]/10">
          <Star className="h-10 w-10 fill-[#C8F135] text-[#C8F135]" />
        </div>
        <div>
          <p className="font-['Syne'] text-4xl font-bold text-white">{avgRating}</p>
          <div className="mt-1 flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < Math.round(ratings) ? 'fill-[#C8F135] text-[#C8F135]' : 'text-zinc-600'}`} />
            ))}
          </div>
          <p className="mt-1 text-sm text-zinc-500">Average rating from {ratings.length} reviews</p>
        </div>
      </motion.div>

      {/* Reviews Table */}
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
                <th className="px-5 py-4 font-medium">Event</th>
                <th className="px-5 py-4 font-medium">Review</th>
                <th className="px-5 py-4 font-medium">Rating</th>
                <th className="px-5 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((rating) => (
                <tr key={rating._id} className="border-b border-zinc-800/50 transition-colors hover:bg-zinc-800/30">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C8F135]/20 text-xs font-bold text-[#C8F135]">
                        {rating?.user?.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-white">{rating?.user?.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-zinc-300">{rating?.event?.title}</td>
                  <td className="max-w-xs px-5 py-4 text-zinc-400">{rating?.text}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < rating.rating ? 'fill-[#C8F135] text-[#C8F135]' : 'text-zinc-600'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-zinc-400">{new Date(rating.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}
