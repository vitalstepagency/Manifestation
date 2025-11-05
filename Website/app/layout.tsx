import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Manifest - Transform Your Dreams Into Reality',
  description: 'Stop planning. Start manifesting. See your goals in 3D, track progress daily, and achieve what once seemed impossible.',
  keywords: ['manifestation', 'goals', '3D', 'habits', 'productivity', 'achievement'],
  authors: [{ name: 'Manifest' }],
  openGraph: {
    title: 'Manifest - Transform Your Dreams Into Reality',
    description: 'The world\'s first 3D manifestation platform',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manifest - Transform Your Dreams Into Reality',
    description: 'Stop planning. Start manifesting.',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
