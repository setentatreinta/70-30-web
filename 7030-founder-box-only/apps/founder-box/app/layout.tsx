import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '70/30 — Founder Box',
  description: 'Experiencia 70/30 con gating por etapas.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-neutral-950 text-neutral-100">{children}</body>
    </html>
  )
}