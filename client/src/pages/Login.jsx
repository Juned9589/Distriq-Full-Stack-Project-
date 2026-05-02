import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Chrome, Apple } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { loginUser, registerUser } from '../features/auth/authSlice'
import { toast } from 'react-toastify'
import LoadingScreen from '../components/LoadingScreen'

export default function Login() {
  const { user, isLoading, isSuccess, isError, message } = useSelector(state => state.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ email: "", password: "" })

  const { email, password } = formData

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(loginUser(formData))
  }

  useEffect(() => {

    if (!user) return


    if (user.isAdmin) {
      navigate('/admin')
    } else {
      navigate('/profile')
    }


    if (isError && message) {
      toast.error(message, { position: "top-center", theme: "dark" })
    }


  }, [user, isError, message])

  if (isLoading) {
    return (
      <LoadingScreen />
    )
  }

  return (
    <motion.div
      className="flex min-h-screen bg-zinc-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Left Panel */}
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-zinc-900 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(200,241,53,0.08),transparent)]" />
        <motion.div
          className="relative z-10 px-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h2 className="mb-4 font-['Syne'] text-5xl font-bold text-white">
            Welcome to<br /><span className="text-[#C8F135]">Distriq</span>
          </h2>
          <p className="text-lg text-zinc-400">Discover experiences that match your vibe.</p>
          <div className="mt-12 grid grid-cols-2 gap-4">
            {['https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400', 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=400'].map((img, i) => (
              <motion.div
                key={i}
                className="overflow-hidden rounded-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <img src={img} alt={`Event ${i + 1}`} className="h-32 w-full object-cover" loading="lazy" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Link to="/" className="mb-8 inline-block font-['Syne'] text-2xl font-bold text-white lg:hidden">
            <span className="text-[#C8F135]">●</span>Distriq
          </Link>

          <h1 className="mb-2 font-['Syne'] text-3xl font-bold text-white">Welcome Back</h1>
          <p className="mb-8 text-sm text-zinc-500">Sign in to continue to Distriq</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-zinc-400">Email</label>
              <div className="flex items-center gap-3 rounded-xl border border-zinc-700/50 bg-zinc-800/40 px-4 py-3 backdrop-blur-lg transition-colors focus-within:border-[#C8F135]">
                <Mail className="h-4 w-4 text-zinc-500" />
                <input onChange={handleChange} value={email} name='email' type="email" placeholder="you@email.com" className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500" />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400">Password</label>
              <div className="flex items-center gap-3 rounded-xl border border-zinc-700/50 bg-zinc-800/40 px-4 py-3 backdrop-blur-lg transition-colors focus-within:border-[#C8F135]">
                <Lock className="h-4 w-4 text-zinc-500" />
                <input onChange={handleChange} value={password} name='password' type="password" placeholder="••••••••" className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-zinc-500 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 rounded accent-[#C8F135]" />
                Remember me
              </label>
              <a href="#" className="text-sm text-[#C8F135] transition-colors hover:underline">Forgot Password?</a>
            </div>

            <motion.button
              onSubmit={handleSubmit}
              type='submit'
              className="w-full rounded-full bg-[#C8F135] py-3.5 font-bold text-zinc-950 transition-all duration-300"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Login
            </motion.button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-800" />
            <span className="text-xs text-zinc-600">or continue with</span>
            <div className="h-px flex-1 bg-zinc-800" />
          </div>

          <div className="flex gap-4">
            <motion.button
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-zinc-700 py-3 text-sm text-white transition-all duration-300 hover:border-[#C8F135]"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Chrome className="h-4 w-4" /> Google
            </motion.button>
            <motion.button
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-zinc-700 py-3 text-sm text-white transition-all duration-300 hover:border-[#C8F135]"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Apple className="h-4 w-4" /> Apple
            </motion.button>
          </div>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[#C8F135] hover:underline">Register</Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
