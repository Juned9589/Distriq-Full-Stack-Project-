import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Users, Calendar, IndianRupee, Music, Palette, Cpu, Laugh, Film, Dumbbell, UtensilsCrossed, Star } from 'lucide-react'
import EventCard from '../components/EventCard'
import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux'
import { getEvents } from '../features/event/eventSlice'

// ─── FIX 1: Define categories array ───────────────────────────────────────────
const categories = ['All', 'Music', 'Art', 'Tech', 'Comedy', 'Film', 'Sports', 'Food']

const categoryIcons = {
  All: Sparkles, Music: Music, Art: Palette, Tech: Cpu,
  Comedy: Laugh, Film: Film, Sports: Dumbbell, Food: UtensilsCrossed,
}

const categoryCounts = { All: 48, Music: 12, Art: 8, Tech: 6, Comedy: 7, Film: 5, Sports: 4, Food: 6 }

// ─── FIX 2: Define chatMessages array ─────────────────────────────────────────
const chatMessages = [
  { _id: 1, role: 'user', text: 'Find me a music event this weekend 🎵' },
  { _id: 2, role: 'assistant', text: 'I found 3 events near you — Echoes Live, Bass Drop, and Jazz Night!' },
]

// ─── FIX 3: Define comments (testimonials) array ──────────────────────────────
const comments = [
  {
    _id: 1,
    user: { name: 'Aanya Sharma' },
    rating: 5,
    text: 'Absolutely loved the experience! Found the event through AI recommendation and it was perfect.',
    event: { title: 'Sunburn Festival 2024' },
  },
  {
    _id: 2,
    user: { name: 'Rohan Mehta' },
    rating: 5,
    text: 'Booking was seamless and the event was unforgettable. Will definitely use Distriq again!',
    event: { title: 'TEDx Bangalore' },
  },
  {
    _id: 3,
    user: { name: 'Priya Nair' },
    rating: 4,
    text: 'Great platform! The AI chat helped me discover events I never would have found on my own.',
    event: { title: 'Comedy Chaos Night' },
  },
]

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }

export default function Home() {
  const { events } = useSelector(state => state.event)
  const dispatch = useDispatch()

  const featured = events?.filter(e => e.isActive) || []

  useEffect(() => {
    dispatch(getEvents(3))
  }, [dispatch])

  return (
    <div className="min-h-screen bg-zinc-950">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(200,241,53,0.15),transparent)]">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-6 pt-24 lg:flex-row lg:pt-0">

          {/* Left column */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <motion.div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-700/50 bg-zinc-800/40 px-4 py-2 backdrop-blur-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="h-4 w-4 text-[#C8F135]" />
              <span className="text-sm text-zinc-300">AI-Powered Discovery</span>
            </motion.div>

            <h1 className="mb-6 font-['Syne'] text-4xl font-800 leading-[0.95] tracking-tight text-white md:text-7xl lg:text-8xl xl:text-9xl">
              Discover Events<br />
              <span className="text-[#C8F135]">That Move You</span>
            </h1>

            <p className="mx-auto mb-8 max-w-lg text-lg text-zinc-400 lg:mx-0">
              Let AI match you with unforgettable experiences. From electrifying concerts to intimate workshops — your next memory is one click away.
            </p>

            <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
              <Link to="/events">
                <motion.button
                  className="flex items-center gap-2 rounded-full bg-[#C8F135] px-8 py-3 font-bold text-zinc-950 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Explore Events <ArrowRight className="h-4 w-4" />
                </motion.button>
              </Link>
              <a href="#how-it-works">
                <motion.button
                  className="rounded-full border border-zinc-600 px-8 py-3 font-bold text-white transition-all duration-300 hover:border-[#C8F135] hover:text-[#C8F135]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  How it Works
                </motion.button>
              </a>
            </div>


          </motion.div>

          {/* Right column — floating event cards */}
          <motion.div
            className="relative hidden h-[480px] w-[380px] lg:block"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {featured.map((ev, i) => (
              <motion.div
                key={ev._id}
                // ─── FIX 4: removed invalid `event={ev}` prop from motion.div ───
                className="absolute w-72 overflow-hidden rounded-3xl border border-zinc-700/30 bg-zinc-800/60 shadow-2xl backdrop-blur-2xl"
                style={{
                  top: `${60 + i * 100}px`,
                  left: `${i * 50}px`,
                  rotate: i === 0 ? '-6deg' : i === 1 ? '3deg' : '-2deg',
                  zIndex: 3 - i,
                }}
                animate={{ y: [0, -12, 0] }}
                transition={{
                  y: { duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' },
                }}
              >
                <img src={ev.eventImage} alt={ev.title} className="h-40 w-full object-cover" loading="lazy" />
                <div className="p-4">
                  <p className="text-xs font-semibold text-[#C8F135]">{ev.eventArtistName}</p>
                  <p className="mt-1 font-['Syne'] text-sm font-bold text-white">{ev.title}</p>
                  <p className="mt-2 font-['Syne'] text-lg font-bold text-white">
                    ₹{ev.ticketPrice.toLocaleString('en-IN')}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Ticker */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden border-t border-zinc-800/50 bg-zinc-950/80 py-4 backdrop-blur-lg">
          <motion.div
            className="flex gap-4 whitespace-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            {[...categories, ...categories, ...categories, ...categories].map((cat, i) => (
              <span
                key={i}
                className="shrink-0 rounded-full border border-zinc-700/50 bg-zinc-800/40 px-5 py-2 text-sm text-zinc-400"
              >
                {cat}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Featured Events ───────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            className="mb-12 text-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <h2 className="mb-2 font-['Syne'] text-4xl font-bold text-white md:text-5xl">
              Trending Right Now
            </h2>
            <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#C8F135]" />
          </motion.div>

          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {featured.map((ev, i) => (
              <motion.div key={ev._id} variants={fadeUp}>
                <EventCard event={ev} index={i} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-12 text-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Link to="/events">
              <motion.button
                className="rounded-full border border-zinc-600 px-8 py-3 font-bold text-white transition-all duration-300 hover:border-[#C8F135] hover:text-[#C8F135]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                View All Events
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.h2
            className="mb-16 text-center font-['Syne'] text-4xl font-bold text-white md:text-5xl"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            How It Works
          </motion.h2>

          <motion.div
            className="grid gap-8 md:grid-cols-3"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {[
              { num: '01', title: 'Browse', desc: 'Explore curated events powered by AI recommendations tailored to your taste.' },
              { num: '02', title: 'Book', desc: 'Secure your tickets instantly with our seamless booking experience.' },
              { num: '03', title: 'Show Up', desc: 'Walk in with your digital ticket and immerse yourself in the experience.' },
            ].map((step) => (
              <motion.div
                key={step.num}
                variants={fadeUp}
                className="group rounded-3xl border border-zinc-700/30 bg-zinc-800/40 p-8 backdrop-blur-2xl transition-all duration-300 hover:border-[#C8F135]/30"
              >
                <span className="font-['Syne'] text-5xl font-bold text-[#C8F135]/20 transition-colors group-hover:text-[#C8F135]/40">
                  {step.num}
                </span>
                <h3 className="mt-4 font-['Syne'] text-2xl font-bold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── AI Chat Banner ────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            className="flex flex-col items-center gap-12 overflow-hidden rounded-3xl border border-zinc-700/30 bg-zinc-900/60 p-8 backdrop-blur-2xl md:flex-row md:p-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <div className="flex-1">
              <h2 className="mb-4 font-['Syne'] text-3xl font-bold text-white md:text-4xl">
                Ask <span className="text-[#C8F135]">Distriq AI</span> Anything
              </h2>
              <p className="mb-6 text-zinc-400">
                Find events, get recommendations, and book tickets — all through a simple conversation with our AI assistant.
              </p>
              <Link to="/ai-chat">
                <motion.button
                  className="flex items-center gap-2 rounded-full bg-[#C8F135] px-8 py-3 font-bold text-zinc-950"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Sparkles className="h-4 w-4" /> Try AI Chat
                </motion.button>
              </Link>
            </div>

            <div className="w-full max-w-sm rounded-2xl border border-zinc-700/50 bg-zinc-800/60 p-4">
              {chatMessages.slice(0, 2).map((msg) => (
                <div key={msg._id} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'user' ? 'bg-[#C8F135] text-zinc-950' : 'bg-zinc-700 text-zinc-300'
                      }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div className="mt-2 flex items-center gap-2 rounded-full bg-zinc-700/50 px-4 py-2 text-sm text-zinc-500">
                Ask me about events...
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.h2
            className="mb-12 text-center font-['Syne'] text-4xl font-bold text-white md:text-5xl"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            Explore Categories
          </motion.h2>

          <motion.div
            className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {categories.map((cat) => {
              const Icon = categoryIcons[cat] || Sparkles
              return (
                <motion.div
                  key={cat}
                  variants={fadeUp}
                  whileHover={{ scale: 1.05 }}
                  className="group cursor-pointer rounded-3xl border border-zinc-700/30 bg-zinc-800/40 p-6 text-center backdrop-blur-2xl transition-all duration-300 hover:border-[#C8F135]/50 hover:shadow-[0_0_30px_rgba(200,241,53,0.1)]"
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-700/50 text-zinc-400 transition-colors group-hover:bg-[#C8F135]/10 group-hover:text-[#C8F135]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-['Syne'] text-sm font-bold text-white">{cat}</h4>
                  <p className="mt-1 text-xs text-zinc-500">{categoryCounts[cat] || 0} events</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.h2
            className="mb-12 text-center font-['Syne'] text-4xl font-bold text-white md:text-5xl"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            What People Say
          </motion.h2>

          <motion.div
            className="grid gap-8 md:grid-cols-3"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {comments.map((c) => {
              const initials = c.user.name.split(' ').map(n => n[0]).join('')
              return (
                <motion.div
                  key={c._id}
                  variants={fadeUp}
                  className="rounded-3xl border border-zinc-700/30 bg-zinc-800/40 p-6 backdrop-blur-2xl"
                >
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < c.rating ? 'fill-[#C8F135] text-[#C8F135]' : 'text-zinc-600'}`}
                      />
                    ))}
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-zinc-300">"{c.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C8F135]/20 text-sm font-bold text-[#C8F135]">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{c.user.name}</p>
                      <p className="text-xs text-zinc-500">{c.event.title}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

    </div>
  )
}
