'use client'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, Mic, Camera, Smile, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { MathExpression } from '@/components/shared/MathExpression'

interface Message {
  role: 'user' | 'assistant'
  content: string
  latex?: string
  steps?: { instruction: string; working_latex?: string }[]
}

export function TutorClient() {
  const router    = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi Ninja! 👋 How can I help you today?',
    },
  ])
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const bottomRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    const newMessages: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.content ?? 'দুঃখিত, সমস্যা হয়েছে।',
        steps:   data.steps,
      }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 border-b border-ninja-border flex items-center gap-3">
        <button onClick={() => router.back()} className="text-ninja-muted">
          <ChevronLeft size={22} />
        </button>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}
        >
          <Image src="/Ninja Greetings.png" alt="tutor" width={40} height={40} className="object-cover" />
        </div>
        <div>
          <p className="font-black text-ninja-text text-sm">AI Tutor</p>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-[10px] text-green-600 font-semibold">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'items-start gap-2'}`}>
            {m.role === 'assistant' && (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}
              >
                <Image src="/chill ninja.png" alt="ai" width={32} height={32} className="object-cover" />
              </div>
            )}
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                m.role === 'user'
                  ? 'text-white rounded-tr-sm'
                  : 'text-ninja-text rounded-tl-sm'
              }`}
              style={{
                background: m.role === 'user'
                  ? 'linear-gradient(135deg,#2D7A3A,#3DAE4F)'
                  : '#F5F5F5',
              }}
            >
              <p className="text-sm font-semibold leading-relaxed">{m.content}</p>
              {m.steps && (
                <div className="mt-3 space-y-2">
                  {m.steps.map((step, si) => (
                    <div key={si} className="bg-white/80 rounded-xl p-2">
                      <p className="text-xs font-bold text-brand-primary mb-1">Step {si + 1}</p>
                      <p className="text-xs text-ninja-text">{step.instruction}</p>
                      {step.working_latex && (
                        <div className="mt-1">
                          <MathExpression latex={step.working_latex} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
              style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}
            >
              <Image src="/chill ninja.png" alt="ai" width={32} height={32} className="object-cover" />
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
              {[0, 1, 2].map(d => (
                <div key={d} className="w-2 h-2 rounded-full bg-ninja-muted animate-bounce"
                  style={{ animationDelay: `${d * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="px-4 pb-8 pt-3 border-t border-ninja-border">
        <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-2.5">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask anything..."
            className="flex-1 bg-transparent text-ninja-text text-sm font-semibold outline-none placeholder:text-ninja-muted"
          />
          <div className="flex items-center gap-2 text-ninja-muted">
            <button><Mic size={18} /></button>
            <button><Camera size={18} /></button>
            <button><Smile size={18} /></button>
          </div>
          <button
            onClick={sendMessage}
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
