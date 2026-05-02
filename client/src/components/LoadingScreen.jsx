import { motion } from 'framer-motion'

export default function LoadingScreen({ fullScreen = true, text = "Your Vibe Your Event" }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.div
          className="absolute h-24 w-24 rounded-full border-2 border-[#C8F135]/30 border-t-[#C8F135]"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />
        <h1 className="font-['Syne'] text-4xl font-bold text-[#C8F135]">Distriq</h1>
      </motion.div>

      <motion.p
        className="mt-8 text-sm tracking-widest text-zinc-500 uppercase"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Your vibe. Your event.
      </motion.p>
    </motion.div>
  )
}
