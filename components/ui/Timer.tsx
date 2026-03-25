'use client'

interface TimerProps {
  timeRemaining: number
  totalTime: number
  className?: string
}

export function Timer({ timeRemaining, totalTime, className = '' }: TimerProps) {
  const progress = timeRemaining / totalTime
  const color =
    progress > 0.6
      ? 'bg-shin-green'
      : progress > 0.3
        ? 'bg-shin-orange'
        : 'bg-shin-red'

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-bold">⏰</span>
        <span className={`font-display text-lg ${progress <= 0.3 ? 'text-shin-red animate-shin-shake' : ''}`}>
          {timeRemaining}s
        </span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full border-2 border-shin-black overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-1000 ease-linear rounded-full`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  )
}
