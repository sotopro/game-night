'use client'

import type { Player } from '@/lib/types'

interface ScoreboardProps {
  players: Player[]
  activePlayerId?: string
}

export function Scoreboard({ players, activePlayerId }: ScoreboardProps) {
  if (players.length === 0) return null

  return (
    <div className="flex items-center justify-center gap-6 bg-shin-black text-white px-4 py-2 rounded-lg">
      {players.map((player, i) => {
        const isActive = player.id === activePlayerId
        const flag = player.lang === 'es' ? '🇻🇪' : '🇨🇳'

        return (
          <div key={player.id} className="flex items-center gap-4">
            {i > 0 && <span className="text-shin-yellow font-display text-xl">VS</span>}
            <div className={`flex items-center gap-2 ${isActive ? 'animate-shin-bounce' : ''}`}>
              <span className="text-sm">{flag}</span>
              <span className="font-bold">{player.name}</span>
              <span className="font-display text-2xl text-shin-yellow">{player.score}</span>
              {isActive && <span className="text-shin-yellow text-xs">👈</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
