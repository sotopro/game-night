'use client'

import type { Player } from '@/lib/types'
import { Badge } from './Badge'

interface PlayerBadgeProps {
  player: Player
  isOnline?: boolean
  isActive?: boolean
  size?: 'sm' | 'md'
}

export function PlayerBadge({ player, isOnline = true, isActive = false, size = 'md' }: PlayerBadgeProps) {
  const flag = player.lang === 'es' ? '🇻🇪' : '🇨🇳'
  const initial = player.name.charAt(0).toUpperCase()
  const bgColor = player.lang === 'es' ? 'bg-shin-blue' : 'bg-shin-red'

  return (
    <div className={`flex items-center gap-2 ${isActive ? 'animate-shin-pop' : ''}`}>
      <div
        className={`
          ${bgColor} text-white font-display flex items-center justify-center
          border-3 border-shin-black rounded-full
          ${size === 'sm' ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-lg'}
        `}
      >
        {initial}
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold ${size === 'sm' ? 'text-sm' : ''}`}>{player.name}</span>
          <span className="text-sm">{flag}</span>
          {isOnline && (
            <span className="w-2.5 h-2.5 bg-shin-green rounded-full animate-pulse border border-shin-black" />
          )}
        </div>
        {isActive && (
          <Badge variant="turn" className="text-xs mt-0.5">
            {player.lang === 'es' ? '¡Tu turno!' : '你的回合!'}
          </Badge>
        )}
      </div>
    </div>
  )
}
