import Link from 'next/link'
import Image from 'next/image'

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center relative overflow-hidden bg-white">
      {/* Top section — white with math symbols */}
      <div className="w-full flex-1 flex flex-col items-center justify-center pt-16 pb-8 px-6 relative">
        {/* Floating math symbols */}
        {[
          { sym: 'Σ', top: '8%',  left: '6%',  size: 28, color: '#2D7A3A', op: 0.15 },
          { sym: 'π', top: '12%', right: '8%', size: 24, color: '#2D7A3A', op: 0.12 },
          { sym: '√', top: '30%', left: '4%',  size: 20, color: '#FFC107', op: 0.2  },
          { sym: '%', top: '5%',  left: '40%', size: 18, color: '#2D7A3A', op: 0.1  },
          { sym: '∞', top: '22%', right: '5%', size: 22, color: '#FFC107', op: 0.15 },
        ].map((s, i) => (
          <span
            key={i}
            className="absolute font-black pointer-events-none animate-float select-none"
            style={{
              fontSize: s.size,
              color: s.color,
              opacity: s.op,
              top: s.top,
              left: (s as any).left,
              right: (s as any).right,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          >
            {s.sym}
          </span>
        ))}

        {/* Logo */}
        <div className="flex items-center gap-2 mb-6 animate-fade-up">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg"
            style={{ background: 'linear-gradient(135deg, #2D7A3A, #3DAE4F)' }}
          >
            M
          </div>
          <h1 className="text-2xl font-black text-ninja-text">
            MathMate <span style={{ color: '#2D7A3A' }}>AI</span>
          </h1>
        </div>

        {/* Ninja illustration */}
        <div className="relative animate-float mb-4" style={{ animationDuration: '3.5s' }}>
          <div
            className="w-52 h-52 rounded-full flex items-center justify-center relative"
            style={{
              background: 'radial-gradient(circle, #E8F5E9 40%, transparent 70%)',
            }}
          >
            <Image
              src="/Ninja Standing With Sword.png"
              alt="Math Ninja"
              width={180}
              height={180}
              className="object-contain drop-shadow-xl"
              priority
            />
          </div>
        </div>

        {/* Brand text */}
        <div className="text-center animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-3xl font-black text-ninja-text mb-1">MathMate AI</h2>
          <p className="text-ninja-muted text-sm font-semibold tracking-wide">
            তোমার ব্যক্তিগত গণিত নিনজা 🥷
          </p>
        </div>
      </div>

      {/* Bottom green card */}
      <div
        className="w-full px-6 pt-8 pb-10 rounded-t-[32px]"
        style={{ background: 'linear-gradient(160deg, #1B5E20, #2D7A3A)' }}
      >
        <p className="text-center text-white/70 text-sm mb-6 font-semibold">
          Learn • Practice • Master
        </p>

        <Link
          href="/signup"
          className="block w-full bg-white text-center py-4 rounded-2xl font-black text-base mb-3 active:scale-95 transition-transform"
          style={{ color: '#2D7A3A' }}
        >
          Continue →
        </Link>

        <Link
          href="/login"
          className="block w-full border-2 border-white/30 text-white text-center py-3.5 rounded-2xl font-bold text-sm active:scale-95 transition-transform"
        >
          Login
        </Link>

        <p className="text-center text-white/40 text-xs mt-6 font-medium">
          Join millions of students improving math the fun way! 🚀
        </p>
      </div>
    </main>
  )
}
