import Link from 'next/link'
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-white">
      <div className="text-7xl mb-4">🥷</div>
      <h2 className="text-2xl font-black text-ninja-text mb-2">পেজ খুঁজে পাওয়া যায়নি</h2>
      <p className="text-ninja-muted mb-6 text-sm">এই ninja পেজটি অস্তিত্বহীন!</p>
      <Link href="/dashboard"
        className="text-white px-6 py-3 rounded-2xl font-black text-sm active:scale-95 transition-transform"
        style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}>
        ← ড্যাশবোর্ডে ফিরে যাও
      </Link>
    </div>
  )
}
