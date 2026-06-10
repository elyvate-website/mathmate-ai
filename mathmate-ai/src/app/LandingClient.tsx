'use client'
import Link  from 'next/link'
import Image from 'next/image'

const MATH_SYMBOLS = [
  { sym: 'Σ',  top: '8%',  left: '6%',   size: 32, opacity: 0.55, color: '#2D7A3A', rotate: -10 },
  { sym: 'O',  top: '7%',  left: '48%',  size: 16, opacity: 0.45, color: '#2D7A3A', rotate: 0 },
  { sym: '√x', top: '10%', left: '78%',  size: 28, opacity: 0.60, color: '#2D7A3A', rotate: 5 },
  { sym: '%',  top: '26%', left: '4%',   size: 34, opacity: 0.55, color: '#2D7A3A', rotate: -5 },
  { sym: '÷',  top: '28%', left: '88%',  size: 26, opacity: 0.45, color: '#2D7A3A', rotate: 0 },
  { sym: 'π',  top: '50%', left: '5%',   size: 28, opacity: 0.50, color: '#2D7A3A', rotate: 0 },
  { sym: '×',  top: '48%', left: '88%',  size: 22, opacity: 0.55, color: '#2D7A3A', rotate: 15 },
  { sym: '×',  top: '20%', left: '56%',  size: 13, opacity: 0.35, color: '#2D7A3A', rotate: 10 },
  { sym: '×',  top: '35%', left: '32%',  size: 11, opacity: 0.30, color: '#2D7A3A', rotate: -5 },
  { sym: '+',  top: '62%', left: '72%',  size: 14, opacity: 0.35, color: '#2D7A3A', rotate: 0 },
  { sym: '×',  top: '72%', left: '14%',  size: 12, opacity: 0.30, color: '#2D7A3A', rotate: 10 },
]

export default function LandingClient() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center" style={{ fontFamily: 'var(--font-plus-jakarta)' }}>
      <div className="w-full max-w-[430px] min-h-screen flex flex-col relative overflow-hidden">

        {/* Floating math symbols */}
        {MATH_SYMBOLS.map((s, i) => (
          <span
            key={i}
            className="pointer-events-none absolute select-none font-black"
            style={{
              top: s.top, left: s.left,
              fontSize: s.size,
              opacity: s.opacity,
              color: s.color,
              transform: `rotate(${s.rotate}deg)`,
              fontStyle: 'italic',
              zIndex: 0,
            }}
          >
            {s.sym}
          </span>
        ))}

        {/* Hero section */}
        <div className="relative z-10 flex flex-col items-center pt-16 px-6 flex-1">
          {/* Title */}
          <p className="text-ninja-text text-lg font-semibold mb-1">Welcome to</p>
          <h1 className="text-center mb-1" style={{ fontSize: 38, fontWeight: 900, lineHeight: 1.15 }}>
            <span className="text-ninja-text">MathMate </span>
            <span style={{ color: '#2D7A3A' }}>AI</span>
          </h1>
          <p className="text-ninja-muted text-sm font-medium mb-8">
            Your personal AI math ninja ⭐
          </p>

          {/* Ninja image in circle */}
          <div className="relative mb-10">
            {/* Outer dashed circle */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: '2px solid #2D7A3A',
                borderRadius: '50%',
                width: 260, height: 260,
                left: '50%', top: '50%',
                transform: 'translate(-50%,-50%)',
                opacity: 0.35,
              }}
            />
            {/* Shuriken left */}
            <div
              className="absolute"
              style={{ left: -20, bottom: 60, zIndex: 2, opacity: 0.7 }}
            >
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <path d="M22 2L26 18L42 22L26 26L22 42L18 26L2 22L18 18Z" fill="#888" opacity="0.8"/>
                <circle cx="22" cy="22" r="4" fill="#aaa"/>
              </svg>
            </div>
            {/* Shuriken right */}
            <div
              className="absolute"
              style={{ right: -18, top: 50, zIndex: 2, opacity: 0.65 }}
            >
              <svg width="36" height="36" viewBox="0 0 44 44" fill="none">
                <path d="M22 2L26 18L42 22L26 26L22 42L18 26L2 22L18 18Z" fill="#999" opacity="0.8"/>
                <circle cx="22" cy="22" r="4" fill="#bbb"/>
              </svg>
            </div>
            {/* Green crescent */}
            <div className="absolute" style={{ right: 10, bottom: 90, zIndex: 2 }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M18 11C18 15 15 18 11 18C7 18 4 15 4 11C4 9 4.8 7.2 6 6C4 7.5 3 9.6 3 12C3 17 7 21 12 21C17 21 21 17 21 12C21 9.5 19.8 7.3 18 6C18.8 7.5 18 9 18 11Z" fill="#2D7A3A" opacity="0.7"/>
              </svg>
            </div>

            {/* Background circle glow */}
            <div
              className="relative flex items-center justify-center"
              style={{ width: 240, height: 240 }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(45,122,58,0.08) 0%, rgba(45,122,58,0.03) 60%, transparent 100%)' }}
              />
              <div
                className="absolute inset-4 rounded-full"
                style={{ border: '1.5px dashed rgba(45,122,58,0.25)' }}
              />
              <Image
                src="/Ninja Standing With Sword.png"
                alt="Math Ninja"
                width={200}
                height={200}
                className="object-contain relative z-10 drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="w-full space-y-3 pb-8">
            <Link href="/signup" className="block">
              <button
                className="w-full py-4 rounded-full font-black text-white text-base active:scale-95 transition-transform shadow-lg"
                style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)', boxShadow: '0 8px 24px rgba(45,122,58,0.35)' }}
              >
                Continue
              </button>
            </Link>

            <Link href="/login" className="block">
              <button
                className="w-full py-4 rounded-full font-black text-ninja-text text-base active:scale-95 transition-transform border-2"
                style={{ borderColor: '#E0E0E0', background: 'white' }}
              >
                Login
              </button>
            </Link>

            <Link href="/signup" className="block">
              <button
                className="w-full py-4 rounded-full font-black text-base active:scale-95 transition-transform border-2"
                style={{ borderColor: '#2D7A3A', color: '#2D7A3A', background: 'white' }}
              >
                Create Account
              </button>
            </Link>

            <p className="text-center text-ninja-muted text-sm pt-2 leading-relaxed">
              Join millions of students improving<br />math the fun way! 🚀
            </p>
          </div>
        </div>

      </div>
    </main>
  )
}
