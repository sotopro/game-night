'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface UseTimerOptions {
  duration: number
  onExpire?: () => void
  autoStart?: boolean
}

export function useTimer({ duration, onExpire, autoStart = false }: UseTimerOptions) {
  const [timeRemaining, setTimeRemaining] = useState(duration)
  const [isRunning, setIsRunning] = useState(autoStart)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const next = prev - 1
        if (next <= 0) {
          setIsRunning(false)
          onExpireRef.current?.()
          return 0
        }
        return next
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, timeRemaining])

  const start = useCallback(() => setIsRunning(true), [])
  const pause = useCallback(() => setIsRunning(false), [])
  const reset = useCallback(
    (newDuration?: number) => {
      setTimeRemaining(newDuration ?? duration)
      setIsRunning(false)
    },
    [duration]
  )

  const restart = useCallback(
    (newDuration?: number) => {
      setTimeRemaining(newDuration ?? duration)
      setIsRunning(true)
    },
    [duration]
  )

  const progress = timeRemaining / duration

  return { timeRemaining, isRunning, progress, start, pause, reset, restart }
}
