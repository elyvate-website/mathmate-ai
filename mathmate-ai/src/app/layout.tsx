import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MathMate AI — তোমার ব্যক্তিগত গণিত নিনজা',
  description: 'NCTB ৯ম-১০ম শ্রেণির গণিত শিক্ষার AI অ্যাপ। প্রতিটি সমস্যা হবে একটি ইন্টারেক্টিভ যাত্রা।',
  manifest: '/manifest.json',
  icons: { icon: '/favicon.ico' },
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
      </head>
      <body className="font-nunito antialiased bg-ninja-gray">
        <div className="flex justify-center min-h-screen bg-[#F0F0F0]">
          <div className="w-full max-w-phone bg-white min-h-screen relative overflow-hidden">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
