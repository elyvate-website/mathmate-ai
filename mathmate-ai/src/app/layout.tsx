import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MathMate AI — তোমার ব্যক্তিগত গণিত নিনজা',
  description: 'NCTB ৯ম-১০ম শ্রেণির গণিত শিক্ষার AI অ্যাপ।',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#2D7A3A',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="antialiased bg-[#F2F4F3]">
        <div className="flex justify-center min-h-screen bg-[#E8EAE9]">
          <div className="w-full max-w-[430px] bg-white min-h-screen relative overflow-hidden shadow-2xl">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
