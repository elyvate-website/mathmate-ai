'use client'
import { useState, useRef, useEffect } from 'react'
import Image    from 'next/image'
import { Send, ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Message { role: 'user'|'assistant'; content: string }

const QUICK = [
  'x² + 5x + 6 উৎপাদক করো',
  'sin 30° = কত?',
  'লগারিদমের সূত্র বলো',
  '(a+b)² ব্যাখ্যা করো',
]

export function TutorClient() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    { role:'assistant', content:'হ্যালো! 👋 আমি তোমার AI গণিত শিক্ষক। যেকোনো প্রশ্ন করো, ধাপে ধাপে বুঝিয়ে দেবো!' }
  ])
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  const send = async (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg || loading) return
    setInput('')
    const newMsgs: Message[] = [...messages, { role:'user', content:msg }]
    setMessages(newMsgs)
    setLoading(true)
    try {
      const res  = await fetch('/api/tutor', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ messages: newMsgs }) })
      const data = await res.json()
      setMessages(prev => [...prev, { role:'assistant', content: data.content ?? 'দুঃখিত, সমস্যা হয়েছে।' }])
    } catch {
      setMessages(prev => [...prev, { role:'assistant', content:'সংযোগ সমস্যা। আবার চেষ্টা করো।' }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="flex flex-col h-screen" style={{ background:'#F7F9F7' }}>

      {/* Header */}
      <div className="px-4 pt-12 pb-3 bg-white border-b border-ninja-border flex items-center gap-3 shadow-sm">
        <button onClick={()=>router.back()} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background:'#F5F5F5' }}>
          <ChevronLeft size={20} className="text-ninja-dark" />
        </button>
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0" style={{ background:'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}>
          <Image src="/Ninja Greetings.png" alt="tutor" width={40} height={40} className="object-cover" />
        </div>
        <div className="flex-1">
          <p className="font-black text-ninja-dark text-sm">AI গণিত শিক্ষক</p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" style={{ animation:'pulseRing 2s ease-in-out infinite' }} />
            <span className="text-[10px] text-green-600 font-bold">সক্রিয়</span>
          </div>
        </div>
        <span className="text-[10px] font-black px-2.5 py-1 rounded-full" style={{ background:'#E8F5E9', color:'#2D7A3A' }}>Groq AI</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex msg-enter ${m.role==='user'?'justify-end':'items-start gap-2'}`}
            style={{ animationDelay:`${i*0.04}s` }}>
            {m.role==='assistant' && (
              <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden" style={{ background:'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}>
                <Image src="/chill ninja.png" alt="ai" width={32} height={32} className="object-cover" />
              </div>
            )}
            <div className={`max-w-[78%] px-4 py-3 text-sm font-semibold leading-relaxed ${m.role==='user'?'rounded-2xl rounded-tr-sm text-white':'rounded-2xl rounded-tl-sm text-ninja-dark'}`}
              style={{
                background: m.role==='user' ? 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' : '#FFFFFF',
                boxShadow: m.role==='assistant' ? 'var(--shadow-flat)' : 'var(--shadow-green)',
                borderLeft: m.role==='assistant' ? '3px solid #2D7A3A' : 'none',
              }}>
              {m.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-start gap-2 msg-enter">
            <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden" style={{ background:'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}>
              <Image src="/chill ninja.png" alt="ai" width={32} height={32} className="object-cover" />
            </div>
            <div className="rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center bg-white" style={{ boxShadow:'var(--shadow-flat)' }}>
              {[0,1,2].map(d=>(
                <div key={d} className="w-2 h-2 rounded-full animate-bounce"
                  style={{ background:'#2D7A3A', animationDelay:`${d*0.15}s`, opacity: 0.7 }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {messages.length === 1 && (
        <div className="px-4 pb-3">
          <p className="text-ninja-muted text-xs font-bold mb-2">দ্রুত প্রশ্ন করো</p>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {QUICK.map(q=>(
              <button key={q} onClick={()=>send(q)}
                className="text-xs font-bold px-3 py-2 rounded-full whitespace-nowrap active:scale-95 transition-transform flex-shrink-0"
                style={{ background:'#E8F5E9', color:'#2D7A3A', border:'1.5px solid #C8E6C9' }}>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="px-4 pb-8 pt-2 bg-white border-t border-ninja-border">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl" style={{ background:'#F5F5F5' }}>
          <input ref={inputRef} value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&send()}
            placeholder="গণিতের যেকোনো প্রশ্ন করো..."
            className="flex-1 bg-transparent text-ninja-dark text-sm font-semibold outline-none placeholder:text-ninja-muted"
          />
          <span className="text-ninja-muted text-[10px] font-bold mr-1">{input.length}/200</span>
          <button onClick={()=>send()} disabled={!input.trim()||loading}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all disabled:opacity-40 active:scale-90"
            style={{ background:'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}>
            <Send size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
