import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950">
      {/* Floating Particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-[#C8F135]/30"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
          }}
          animate={{
            y: [null, Math.random() * -400],
            opacity: [0.3, 0.8, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}

      <motion.div
        className="relative z-10 text-center px-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.h1
          className="mb-4 font-['Syne'] text-[10rem] font-800 leading-none text-[#C8F135] md:text-[14rem]"
          animate={{
            textShadow: [
              '0 0 20px rgba(200,241,53,0.3)',
              '0 0 60px rgba(200,241,53,0.15)',
              '0 0 20px rgba(200,241,53,0.3)',
            ],
            x: [0, -3, 3, -1, 1, 0],
          }}
          transition={{
            textShadow: { duration: 2, repeat: Infinity },
            x: { duration: 0.3, repeat: Infinity, repeatDelay: 3 },
          }}
        >
          404
        </motion.h1>

        <h2 className="mb-4 font-['Syne'] text-3xl font-bold text-white md:text-4xl">
          Oops! You got lost.
        </h2>
        <p className="mb-8 text-lg text-zinc-500">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link to="/">
          <motion.button
            className="inline-flex items-center gap-2 rounded-full bg-[#C8F135] px-8 py-3 font-bold text-zinc-950 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <Home className="h-5 w-5" /> Back to Home
          </motion.button>
        </Link>
      </motion.div>
    </div>
  )
}
