import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Mail, Phone, Instagram, Twitter, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="mb-4 inline-block font-['Syne'] text-2xl font-bold text-white">
              <span className="text-[#C8F135]">●</span>Distriq
            </Link>
            <p className="mb-6 text-sm leading-relaxed text-zinc-500">
              AI-powered event discovery. Find experiences that match your vibe, book instantly, and create memories.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Youtube].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 text-zinc-500 transition-all duration-300 hover:border-[#C8F135] hover:text-[#C8F135]"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Social ${i}`}
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-['Syne'] text-sm font-semibold tracking-wider text-white uppercase">Quick Links</h4>
            <div className="flex flex-col gap-3">
              {[{ l: 'Events', p: '/events' }, { l: 'My Tickets', p: '/my-tickets' }, { l: 'Profile', p: '/profile' }].map((item) => (
                <Link key={item.p} to={item.p} className="text-sm text-zinc-500 transition-colors hover:text-[#C8F135]">
                  {item.l}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-['Syne'] text-sm font-semibold tracking-wider text-white uppercase">Company</h4>
            <div className="flex flex-col gap-3">
              {['About Us', 'Careers', 'Blog', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <a key={item} href="#" className="text-sm text-zinc-500 transition-colors hover:text-[#C8F135]">
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-['Syne'] text-sm font-semibold tracking-wider text-white uppercase">Contact</h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C8F135]" />
                <p className="text-sm text-zinc-500">Connaught Place, New Delhi, India</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-[#C8F135]" />
                <p className="text-sm text-zinc-500">hello@distriq.in</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-[#C8F135]" />
                <p className="text-sm text-zinc-500">+91 11 2345 6789</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-800/50 pt-8 md:flex-row">
          <p className="text-xs text-zinc-600">© 2025 Distriq. All rights reserved.</p>
          <p className="text-xs text-zinc-600">Built with vibes ♪</p>
        </div>
      </div>
    </footer>
  )
}
