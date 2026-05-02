import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { sendChatMessage, addUserMessage } from '../features/chat/chatSlice'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { messages, isLoading } = useSelector(state => state.chat)

  const scrollToBottom = () => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSend = () => {
    const text = input.trim()
    if (!text || isLoading) return

    dispatch(addUserMessage(text))
    setInput('')
    dispatch(sendChatMessage(text))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="fixed right-4 bottom-20 md:right-8 md:bottom-8 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="mb-4 flex h-[480px] w-80 flex-col overflow-hidden rounded-3xl border border-zinc-700 bg-zinc-900 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C8F135]">
                  <MessageCircle className="h-4 w-4 text-zinc-950" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Distriq AI</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                    <span className="text-xs text-zinc-500">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#C8F135] text-zinc-950 font-medium'
                      : 'bg-zinc-800 text-zinc-300'
                  }`}>
                    {msg.role === 'user' ? (
                      msg.text
                    ) : (
                      <div className="space-y-3">
                        <p>{typeof msg.text === 'object' ? msg.text.text : msg.text}</p>
                        {msg.text?.events?.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {msg.text.events.map((event, idx) => (
                              <div 
                                key={idx} 
                                onClick={() => event.id && navigate(`/events/${event.id}`)}
                                className="rounded-lg bg-zinc-900/40 p-3 border border-zinc-700/40 hover:border-[#C8F135]/50 cursor-pointer transition-all"
                              >
                                <h6 className="font-bold text-[#C8F135] text-xs mb-1">{event.title}</h6>
                                <p className="text-[10px] text-zinc-500 leading-tight">
                                  📅 {event.date} | 📍 {event.location}
                                </p>
                                <p className="text-[10px] font-bold text-white mt-1">💰 {event.price}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800 rounded-2xl px-4 py-3">
                    <Loader2 className="h-4 w-4 text-zinc-400 animate-spin" />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-zinc-800 p-3 flex-shrink-0">
              {!user && (
                <p className="text-xs text-zinc-500 text-center mb-2">Log in to send messages</p>
              )}
              <div className="flex items-center gap-2 rounded-full bg-zinc-800 px-4 py-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={user ? 'Ask Distriq AI...' : 'Login to chat...'}
                  disabled={!user || isLoading}
                  className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500 disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!user || isLoading || !input.trim()}
                  className="rounded-full bg-[#C8F135] p-2 text-zinc-950 transition-colors hover:bg-[#d4f548] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C8F135] text-zinc-950 shadow-lg shadow-[#C8F135]/20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
