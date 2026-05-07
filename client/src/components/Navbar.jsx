import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Ticket, Menu, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser, getMe } from '../features/auth/authSlice'
import { Coins } from 'lucide-react'


const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Events', path: '/events' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const user = useSelector(state => state.auth.user)

  const filteredLinks = user
    ? [
        ...navLinks, 
        { label: 'My Tickets', path: '/my-tickets' }, 
        { label: 'Profile', path: '/profile' },
        ...(user.isAdmin ? [{ label: 'Admin', path: '/admin' }] : [])
      ]
    : navLinks

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (user && user.token) {
      dispatch(getMe())
    }
  }, [dispatch])

  // ✅ Early return AFTER all hooks
  if (location.pathname.startsWith('/admin')) return null

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/login')
  }

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 py-3' : 'bg-transparent py-5'}`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-1 font-['Syne'] text-xl font-bold text-white">
            <span className="text-[#C8F135]">●</span>Distriq
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 md:flex">
            {filteredLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`group relative text-sm font-medium transition-colors duration-300 ${location.pathname === link.path ? 'text-[#C8F135]' : 'text-zinc-400 hover:text-white'}`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#C8F135] transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden items-center gap-4 md:flex">
            <button className="rounded-full p-2 text-zinc-400 transition-colors hover:text-white" aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
            <Link to="/my-tickets" className="rounded-full p-2 text-zinc-400 transition-colors hover:text-white" aria-label="My Tickets">
              <Ticket className="h-5 w-5" />
            </Link>

            <Link to={"/profile"} className="flex items-center gap-3">
              {user && (
                <>
                  <div className="flex items-center gap-1.5 rounded-full bg-[#C8F135]/10 px-3 py-1 text-xs font-bold text-[#C8F135]">
                    <Coins className="h-3.5 w-3.5" />
                    ₹{user?.credits?.toLocaleString('en-IN') || 0}
                  </div>
                  <span className="text-sm font-medium text-white">{user?.name || ''}</span>
                </>
              )}
            </Link>

            {user ? (
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full bg-[#C8F135] px-6 py-2 text-sm font-bold text-zinc-950 transition-all duration-300"
              >
                Logout
              </motion.button>
            ) : (
              <Link to="/login" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
                Login
              </Link>
            )}
          </div>

          <button
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:text-white md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col bg-zinc-950/95 backdrop-blur-xl pt-24 md:hidden"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="flex flex-col items-center gap-6 px-6">
              {filteredLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`text-lg font-medium transition-colors ${location.pathname === link.path ? 'text-[#C8F135]' : 'text-zinc-300'}`}
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false) }}
                  className="mt-4 rounded-full bg-[#C8F135] px-8 py-3 font-bold text-zinc-950"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="text-lg font-medium text-zinc-300">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>
                    <button className="mt-4 rounded-full bg-[#C8F135] px-8 py-3 font-bold text-zinc-950">
                      Get Started
                    </button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}