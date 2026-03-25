'use client'

import { useEffect, useRef, useState } from 'react'
import type { Player } from '@/lib/types'

interface SpinnerWheelProps {
  players: Player[]
  targetAngle: number
  isSpinning: boolean
  onSpinComplete?: () => void
}

export function SpinnerWheel({ players, targetAngle, isSpinning, onSpinComplete }: SpinnerWheelProps) {
  const p1 = players[0]
  const p2 = players[1]
  const [currentRotation, setCurrentRotation] = useState(0)
  const wheelRef = useRef<SVGSVGElement>(null)
  const hasCalledComplete = useRef(false)

  useEffect(() => {
    if (isSpinning && targetAngle > 0) {
      // Small delay to ensure the browser registers the initial state before animating
      hasCalledComplete.current = false
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setCurrentRotation(targetAngle)
        })
      })

      const timer = setTimeout(() => {
        if (!hasCalledComplete.current) {
          hasCalledComplete.current = true
          onSpinComplete?.()
        }
      }, 3500)

      return () => clearTimeout(timer)
    }
  }, [isSpinning, targetAngle, onSpinComplete])

  // Reset rotation when not spinning
  useEffect(() => {
    if (!isSpinning) {
      setCurrentRotation(0)
    }
  }, [isSpinning])

  return (
    <div className="relative w-72 h-72 mx-auto select-none">
      {/* Pointer arrow at top - fixed, doesn't rotate */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
        <svg width="36" height="40" viewBox="0 0 36 40">
          <polygon
            points="18,40 2,4 34,4"
            fill="#1A1A1A"
          />
          <polygon
            points="18,36 6,8 30,8"
            fill="#E8272A"
          />
        </svg>
      </div>

      {/* Outer glow when spinning */}
      {isSpinning && (
        <div className="absolute inset-0 rounded-full bg-shin-yellow/20 animate-pulse scale-110" />
      )}

      {/* Spinning wheel */}
      <svg
        ref={wheelRef}
        width="288"
        height="288"
        viewBox="0 0 288 288"
        className="drop-shadow-[5px_5px_0_#1A1A1A]"
        style={{
          transform: `rotate(${currentRotation}deg)`,
          transition: isSpinning
            ? 'transform 3.5s cubic-bezier(0.15, 0.60, 0.15, 1.00)'
            : 'none',
        }}
      >
        {/* Background circle */}
        <circle cx="144" cy="144" r="140" fill="#1A1A1A" />

        {/* Player 1 half (right side - 0 to 180 deg) - Red */}
        <path
          d="M 144 4 A 140 140 0 0 1 144 284"
          fill="#E8272A"
        />

        {/* Player 2 half (left side - 180 to 360 deg) - Yellow */}
        <path
          d="M 144 284 A 140 140 0 0 1 144 4"
          fill="#FFD700"
        />

        {/* Outer border */}
        <circle cx="144" cy="144" r="140" fill="none" stroke="#1A1A1A" strokeWidth="6" />

        {/* Divider line horizontal */}
        <line x1="4" y1="144" x2="284" y2="144" stroke="#1A1A1A" strokeWidth="4" />

        {/* Decorative dots around edge */}
        {[0, 30, 60, 90, 120, 150, 210, 240, 270, 300, 330].map((angle) => {
          const rad = (angle * Math.PI) / 180
          const x = 144 + 126 * Math.cos(rad)
          const y = 144 + 126 * Math.sin(rad)
          return (
            <circle key={angle} cx={x} cy={y} r="4" fill="white" opacity="0.5" />
          )
        })}

        {/* Player 1 name (right/top half - red) */}
        <text
          x="216"
          y="76"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="'Bangers', cursive"
          fontSize="22"
          fill="white"
          stroke="#1A1A1A"
          strokeWidth="3"
          paintOrder="stroke fill"
          transform="rotate(-45, 216, 76)"
        >
          {p1?.name ?? 'Player 1'}
        </text>

        {/* Player 1 flag */}
        <text
          x="216"
          y="100"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="20"
          transform="rotate(-45, 216, 100)"
        >
          {p1?.lang === 'es' ? '🇻🇪' : '🇨🇳'}
        </text>

        {/* Player 2 name (left/bottom half - yellow) */}
        <text
          x="72"
          y="212"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="'Bangers', cursive"
          fontSize="22"
          fill="#1A1A1A"
          stroke="white"
          strokeWidth="2"
          paintOrder="stroke fill"
          transform="rotate(-45, 72, 212)"
        >
          {p2?.name ?? 'Player 2'}
        </text>

        {/* Player 2 flag */}
        <text
          x="72"
          y="236"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="20"
          transform="rotate(-45, 72, 236)"
        >
          {p2?.lang === 'es' ? '🇻🇪' : '🇨🇳'}
        </text>

        {/* Center hub */}
        <circle cx="144" cy="144" r="24" fill="#1A1A1A" stroke="#FFD700" strokeWidth="4" />
        <circle cx="144" cy="144" r="10" fill="#FFD700" />
        <circle cx="144" cy="144" r="4" fill="#E8272A" />
      </svg>
    </div>
  )
}
