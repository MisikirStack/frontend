import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Misikir | Trusted Business Info',
  description: 'Discover and review top businesses in Africa',
  generator: 'misikir.et',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
