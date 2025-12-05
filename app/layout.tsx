import type { Metadata } from 'next'
import './globals.css'
import '../components/Christmas/christmas-effects.css'
import { ChristmasProviderWrapper } from '@/components/Christmas'

export const metadata: Metadata = {
  title: 'cyberzik',
  description: 'Created for Cyberzik',
  // generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ChristmasProviderWrapper>
          {children}
        </ChristmasProviderWrapper>
      </body>
    </html>
  )
}
