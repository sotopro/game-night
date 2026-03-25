import type { Metadata } from 'next'
import { Bangers, Nunito, Noto_Sans_SC, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const bangers = Bangers({ weight: '400', subsets: ['latin'], variable: '--font-display' })
const nunito = Nunito({ subsets: ['latin'], variable: '--font-body', weight: ['400', '700', '900'] })
const notoSansSC = Noto_Sans_SC({ subsets: ['latin'], variable: '--font-chinese', weight: ['400', '700', '900'] })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Game Night 游戏之夜',
  description: 'Mini juegos bilingues en tiempo real para dos jugadoras',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${bangers.variable} ${nunito.variable} ${notoSansSC.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-shin-cream text-shin-black font-body antialiased">
        {children}
      </body>
    </html>
  )
}
