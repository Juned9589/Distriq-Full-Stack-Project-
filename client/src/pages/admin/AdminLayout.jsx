import { Outlet } from 'react-router-dom'
import AdminSidebar from '../../components/AdminSidebar'
import { useState } from 'react'
import { Menu } from 'lucide-react'

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-zinc-900 border-b border-zinc-800 p-4">
        <div className="font-['Syne'] text-xl font-bold text-white">
          <span className="text-[#C8F135]">●</span>Distriq
        </div>
        <button onClick={() => setMobileOpen(true)} className="text-zinc-400 hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="ml-0 md:ml-64 w-full md:max-w-[calc(100vw-16rem)]">
        <div className="min-h-screen p-4 sm:p-6 pt-6 sm:pt-8 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
