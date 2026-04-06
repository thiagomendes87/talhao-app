import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Talhão — Encontre qualquer fazenda no Brasil',
  description: 'Navegue pelo mapa, busque pelo CAR, CPF, coordenadas ou nome da propriedade e baixe o KML em segundos.',
  keywords: 'CAR, SICAR, KML, fazenda, propriedade rural, polígono, georreferenciamento',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
