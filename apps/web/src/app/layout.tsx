import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FleetSure - Roadside Repair for Commercial Fleets',
  description: 'Professional mobile diesel repair services for commercial truck fleets. Get back on the road in under 60 minutes.',
  keywords: ['diesel repair', 'commercial trucks', 'roadside assistance', 'fleet management', 'mobile mechanic'],
  authors: [{ name: 'FleetSure' }],
  openGraph: {
    title: 'FleetSure - Roadside Repair for Commercial Fleets',
    description: 'Professional mobile diesel repair services for commercial truck fleets.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
