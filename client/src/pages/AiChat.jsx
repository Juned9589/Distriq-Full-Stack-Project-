import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, Loader2, Sparkles, User, Bot } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { sendChatMessage, addUserMessage } from '../features/chat/chatSlice'

export default function AiChat() {
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { user } = useSelector(state => state.auth)
  const { messages, isLoading } = useSelector(state => state.chat)

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
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
    <div className="min-h-screen bg-zinc-950 pt-24 pb-12 px-6">
      <div className="mx-auto max-w-4xl h-[calc(100vh-160px)] flex flex-col rounded-3xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="border-b border-zinc-800 bg-zinc-900/80 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C8F135]/10 text-[#C8F135]">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-['Syne'] text-xl font-bold text-white">Distriq AI Assistant</h1>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Ready to help</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block text-right text-xs text-zinc-500 font-medium">
            Powered by Google Gemini
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
          {messages.map((msg) => (
            <motion.div
              key={msg._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center ${
                msg.role === 'user' ? 'bg-[#C8F135] text-zinc-950' : 'bg-zinc-800 text-zinc-400'
              }`}>
                {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </div>
              
              <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-sm md:text-base leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-[#C8F135] text-zinc-950 font-medium rounded-tr-none' 
                  : 'bg-zinc-800 text-zinc-200 rounded-tl-none'
              }`}>
                {msg.role === 'user' ? (
                  msg.text
                ) : (
                  <div className="space-y-4">
                    <p>{typeof msg.text === 'object' ? msg.text.text : msg.text}</p>
                    
                    {msg.text?.events?.length > 0 && (
                      <div className="mt-4 grid gap-3">
                        {msg.text.events.map((event, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => event.id && navigate(`/events/${event.id}`)}
                            className="rounded-xl bg-zinc-900/50 p-4 border border-zinc-700/50 hover:border-[#C8F135]/60 hover:bg-[#C8F135]/5 cursor-pointer transition-all group"
                          >
                            <h5 className="font-bold text-[#C8F135] mb-2 group-hover:translate-x-1 transition-transform">{event.title}</h5>
                            <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
                              <div className="flex items-center gap-1.5">
                                <span className="text-zinc-500">📅</span> {event.date}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-zinc-500">📍</span> {event.location}
                              </div>
                              <div className="flex items-center gap-1.5 font-bold text-white">
                                <span className="text-zinc-500">💰</span> {event.price}
                              </div>
                            </div>
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                <Bot className="h-5 w-5" />
              </div>
              <div className="bg-zinc-800 rounded-2xl rounded-tl-none px-6 py-4">
                <Loader2 className="h-5 w-5 text-[#C8F135] animate-spin" />
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-zinc-900/80 border-t border-zinc-800">
          {!user && (
            <div className="mb-4 text-center p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
              <p className="text-sm text-zinc-400">
                Please <a href="/login" className="text-[#C8F135] hover:underline">login</a> to start a conversation with the AI.
              </p>
            </div>
          )}
          <div className="relative flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={user ? "Ask me about events, locations, or your bookings..." : "Please login to chat..."}
              disabled={!user || isLoading}
              className="flex-1 bg-zinc-800 text-white rounded-2xl px-6 py-4 outline-none border border-zinc-700 focus:border-[#C8F135]/50 transition-all placeholder:text-zinc-500 disabled:opacity-50 shadow-inner"
            />
            <button
              onClick={handleSend}
              disabled={!user || isLoading || !input.trim()}
              className="h-14 w-14 rounded-2xl bg-[#C8F135] text-zinc-950 flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 shadow-lg shadow-[#C8F135]/10"
            >
              <Send className="h-6 w-6" />
            </button>
          </div>
          <p className="mt-4 text-center text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
            Distriq AI may provide inaccurate info. Check important details.
          </p>
        </div>
      </div>
    </div>
  )
}
