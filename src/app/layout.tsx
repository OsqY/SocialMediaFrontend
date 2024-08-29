"use client"

import './globals.css'
import { ThemeProvider } from 'next-themes'
import { Inter } from 'next/font/google'
import ThemeToggle from '@/components/ui/ThemeToggle'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen bg-background text-foreground">
            <header className="p-4 border-b">
              <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">My App</h1>
                <ThemeToggle />
              </div>
            </header>
            <main className="container mx-auto py-8">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}