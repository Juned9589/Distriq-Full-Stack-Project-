import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Calendar, Users, ShoppingBag, Tag, Star, LogOut, X, ExternalLink, User } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../features/auth/authSlice'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Calendar, label: 'Events', path: '/admin/events' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
  { icon: Tag, label: 'Coupons', path: '/admin/coupons' },
  { icon: Star, label: 'Ratings', path: '/admin/ratings' },
]

export default function AdminSidebar({ mobileOpen, setMobileOpen }) {
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) =>
    location.pathname === path ||
    (path === '/admin/dashboard' && location.pathname === '/admin')

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('')
    : 'A'

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/')
  }

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="font-['Syne'] text-xl font-bold text-white">
            <span className="text-[#C8F135]">●</span>Distriq
          </Link>
          <span className="rounded-md bg-[#C8F135]/10 px-2 py-0.5 text-xs font-bold text-[#C8F135]">Admin</span>
        </div>
        <button
          className="md:hidden text-zinc-400 hover:text-white"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-[#C8F135]/10 text-[#C8F135]'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom: User Info + Actions */}
      <div className="border-t border-zinc-800 px-4 py-4 space-y-2">
        {/* Switch to User Panel */}
        <Link
          to="/profile"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 w-full rounded-xl px-3 py-2.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-[#C8F135] transition-all"
        >
          <User className="h-4 w-4" />
          <span>View as User</span>
          <ExternalLink className="h-3 w-3 ml-auto" />
        </Link>

        {/* User Info + Logout */}
        <div className="flex items-center gap-3 rounded-xl px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C8F135]/20 font-['Syne'] text-sm font-bold text-[#C8F135] flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin'}</p>
            <p className="text-xs text-zinc-500 truncate">{user?.email || 'admin'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-red-400"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-64 flex-col border-r border-zinc-800 bg-zinc-900"
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 flex flex-col md:hidden border-r border-zinc-800"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
