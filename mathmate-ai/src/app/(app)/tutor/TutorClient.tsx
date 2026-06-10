'use client'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { MathExpression } from '@/components/shared/MathExpression'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const QUICK_PROMPTS = [
  'x² + 5x + 6 উৎপাদক করো',
  'ত্রিকোণমিতিক অনুপাত কী?',
  'লগারিদমের সূত্র বলো',
  '(a+b)² এর সূত্র ব্যাখ্যা করো',
]

export function TutorClient() {
  const router   = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'হ্যালো! 👋 আমি তোমার AI গণিত শিক্ষক। যেকোনো গণিতের সমস্যা নিয়ে আমাকে জিজ্ঞেস করো, আমি ধাপে ধাপে বুঝিয়ে দেবো!' },
  ])
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg || loading) return
    setInput('')
    const newMessages: Message[] = [...messages, { role: 'user', content: msg }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.content ?? 'দুঃখিত, সমস্যা হয়েছে।' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'সংযোগ সমস্যা। আবার চেষ্টা করো।' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 border-b border-ninja-border flex items-center gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-ninja-muted">
          <ChevronLeft size={20} />
        </button>
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0" style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}>
          <Image src="/Ninja Greetings.png" alt="tutor" width={40} height={40} className="object-cover" />
        </div>
        <div>
          <p className="font-black text-ninja-text text-sm">AI গণিত শিক্ষক</p>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-[10px] text-green-600 font-semibold">সক্রিয়</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'items-start gap-2'}`}>
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden" style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}>
                <Image src="/chill ninja.png" alt="ai" width={32} height={32} className="object-cover" />
              </div>
            )}
            <div
              className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm font-semibold leading-relaxed ${
                m.role === 'user' ? 'text-white rounded-tr-sm' : 'text-ninja-text rounded-tl-sm'
              }`}
              style={{ background: m.role === 'user' ? 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' : '#F5F5F5' }}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden" style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}>
              <Image src="/chill ninja.png" alt="ai" width={32} height={32} className="object-cover" />
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
              {[0,1,2].map(d => (
                <div key={d} className="w-2 h-2 rounded-full bg-ninja-muted animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts — only show when no real conversation yet */}
      {messages.length === 1 && (
        <div className="px-4 pb-3">
          <p className="text-ninja-muted text-xs font-semibold mb-2">দ্রুত প্রশ্ন</p>
          <div className="flex gap-2 flex-wrap">
            {QUICK_PROMPTS.map(q => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-xs font-bold px-3 py-1.5 rounded-full border-2 border-brand-light text-brand-primary bg-brand-light active:scale-95 transition-transform"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="px-4 pb-8 pt-3 border-t border-ninja-border">
        <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-2.5">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="গণিতের প্রশ্ন করো..."
            className="flex-1 bg-transparent text-ninja-text text-sm font-semibold outline-none placeholder:text-ninja-muted"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white disabled:opacity-40 transition-opacity"
            style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
