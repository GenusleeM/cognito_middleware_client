import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Old Mutual - Cognito Admin Portal',
  description: 'Old Mutual AWS Cognito Admin Portal - Manage user pools and application configurations securely',
  keywords: ['Old Mutual', 'AWS Cognito', 'Admin Portal', 'User Management', 'Authentication'],
  authors: [{ name: 'Old Mutual' }],
  creator: 'Old Mutual',
  publisher: 'Old Mutual',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
