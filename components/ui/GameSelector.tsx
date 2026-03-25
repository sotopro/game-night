'use client'

import type { GameType } from '@/lib/types'

const games: { type: GameType; emoji: string; label: { es: string; zh: string }; color: string }[] = [
  { type: 'trivia', emoji: '🧠', label: { es: 'Trivia', zh: '知识问答' }, color: 'bg-shin-blue' },
  { type: 'memory', emoji: '🃏', label: { es: 'Memory', zh: '记忆翻牌' }, color: 'bg-shin-purple' },
  { type: 'pictionary', emoji: '🎨', label: { es: 'Pictionary', zh: '你画我猜' }, color: 'bg-shin-green' },
  { type: 'truth-dare', emoji: '🎴', label: { es: 'Verdad o Reto', zh: '真心话大冒险' }, color: 'bg-shin-red' },
  { type: 'emoji-charades', emoji: '🎭', label: { es: 'Emoji Charades', zh: '表情猜词' }, color: 'bg-shin-orange' },
]

interface GameSelectorProps {
  currentGame: GameType | null
  onSelect: (game: GameType) => void
  lang: 'es' | 'zh'
}

export function GameSelector({ currentGame, onSelect, lang }: GameSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-display text-lg uppercase text-center mb-1">
        {lang === 'es' ? 'JUEGOS' : '游戏'}
      </h3>
      {games.map((game) => (
        <button
          key={game.type}
          onClick={() => onSelect(game.type)}
          className={`
            flex items-center gap-2 p-3 rounded-lg border-3 border-shin-black
            font-bold text-white text-left transition-all cursor-pointer
            ${game.color}
            ${currentGame === game.type ? 'shadow-[4px_4px_0_#1A1A1A] -translate-y-0.5' : 'hover:-translate-y-1 hover:shadow-[4px_4px_0_#1A1A1A]'}
            active:translate-y-0.5 active:shadow-[1px_1px_0_#1A1A1A]
          `}
        >
          <span className="text-2xl">{game.emoji}</span>
          <span className="text-sm leading-tight">{game.label[lang]}</span>
        </button>
      ))}
    </div>
  )
}
