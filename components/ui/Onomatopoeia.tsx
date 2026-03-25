'use client'

import { useEffect, useState } from 'react'

interface OnomatopoeiaProps {
  text: string
  color?: string
  size?: string
  rotation?: number
  duration?: number
}

export function Onomatopoeia({
  text,
  color = 'text-shin-green',
  size = 'text-5xl',
  rotation = -5,
  duration = 2000,
}: OnomatopoeiaProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration)
    return () => clearTimeout(timer)
  }, [duration])

  if (!visible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div
        className={`font-display ${size} ${color} animate-shin-slam`}
        style={{
          transform: `rotate(${rotation}deg)`,
          textShadow: '3px 3px 0 #1A1A1A, -1px -1px 0 #1A1A1A',
          WebkitTextStroke: '2px #1A1A1A',
          paintOrder: 'stroke fill',
        }}
      >
        {text}
      </div>
    </div>
  )
}
