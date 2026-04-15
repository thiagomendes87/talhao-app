import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Talhão — Encontre qualquer fazenda no Brasil',
  description: 'Plataforma geoespacial rural. Navegue por 10 milhões de propriedades, baixe KML, Shapefile e mapas topográficos em segundos.',
  keywords: 'CAR, SICAR, SIGEF, KML, fazenda, propriedade rural, polígono, georreferenciamento, shapefile',
  icons: {
    icon: '/logo-oficial-4.png?v=4',
    shortcut: '/logo-oficial-4.png?v=4',
    apple: '/logo-oficial-4.png?v=4',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}

