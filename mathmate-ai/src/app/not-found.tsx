import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="text-2xl font-black text-gray-900 mb-2">পেজ পাওয়া যায়নি</h1>
      <p className="text-gray-400 mb-6">তুমি যা খুঁজছো তা এখানে নেই।</p>
      <Link href="/dashboard" className="bg-brand-primary text-white px-6 py-3 rounded-2xl font-black hover:bg-brand-dark transition-colors">
        হোমে ফিরে যাও
      </Link>
    </div>
  )
}
