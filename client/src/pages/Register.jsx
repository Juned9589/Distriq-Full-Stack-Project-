import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Lock, ShieldCheck } from 'lucide-react'
import LoadingScreen from '../components/LoadingScreen'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { registerUser } from '../features/auth/authSlice'
import { toast } from 'react-toastify'

export default function Register() {

  const { user, isLoading, isSuccess, isError, message } = useSelector(state => state.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "", confirm: "" })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(registerUser(formData))
  }

  useEffect(() => {

    if (user) {
      navigate("/profile")
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
            Join the<br /><span className="text-[#C8F135]">Movement</span>
          </h2>
          <p className="text-lg text-zinc-400">Create your account and start exploring events.</p>
          <div className="mt-12 space-y-4">
            {[
              { num: '3,420+', label: 'Happy Users' },
              { num: '48', label: 'Live Events' },
              { num: '12,890', label: 'Tickets Booked' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                className="flex items-center justify-between rounded-2xl border border-zinc-700/30 bg-zinc-800/40 px-6 py-4 backdrop-blur-2xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <span className="font-['Syne'] text-2xl font-bold text-[#C8F135]">{stat.num}</span>
                <span className="text-sm text-zinc-400">{stat.label}</span>
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

          <h1 className="mb-2 font-['Syne'] text-3xl font-bold text-white">Create Account</h1>
          <p className="mb-8 text-sm text-zinc-500">Start discovering events that move you</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { icon: User, label: 'Full Name', type: 'text', placeholder: 'Aryan Kapoor', name: 'name' },
              { icon: Mail, label: 'Email', type: 'email', placeholder: 'you@email.com', name: 'email' },
              { icon: Phone, label: 'Phone', type: 'tel', placeholder: '+91 98765 43210', name: 'phone' },
              { icon: Lock, label: 'Password', type: 'password', placeholder: '••••••••', name: 'password' },
              { icon: ShieldCheck, label: 'Confirm Password', type: 'password', placeholder: '••••••••', name: 'confirm' },
            ].map((field) => (
              <div key={field.name}>
                <label className="mb-2 block text-sm text-zinc-400">{field.label}</label>
                <div className="flex items-center gap-3 rounded-xl border border-zinc-700/50 bg-zinc-800/40 px-4 py-3 backdrop-blur-lg transition-colors focus-within:border-[#C8F135]">
                  <field.icon className="h-4 w-4 text-zinc-500" />
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                  />
                </div>
              </div>
            ))}

            <motion.button
              type="submit"
              className="w-full rounded-full bg-[#C8F135] py-3.5 font-bold text-zinc-950 transition-all duration-300"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Create Account
            </motion.button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#C8F135] hover:underline">Login</Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}