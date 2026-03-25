'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useGameStore } from '@/lib/store'
import { getPusherClient } from '@/lib/pusher'
import { useTimer } from '@/hooks/useTimer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Timer } from '@/components/ui/Timer'
import { Scoreboard } from '@/components/ui/Scoreboard'
import { Onomatopoeia } from '@/components/ui/Onomatopoeia'
import type { Lang, PictionaryData } from '@/lib/types'

interface PictionaryProps {
  lang: Lang
  roomCode: string
  playerId: string
}

interface StrokePoint {
  x: number
  y: number
}

interface Stroke {
  points: StrokePoint[]
  color: string
  width: number
}

const CANVAS_BG = '#FFFEF0'
const COLORS = [
  { value: '#1A1A1A', label: 'Black' },
  { value: '#E8272A', label: 'Red' },
  { value: '#1B5FAA', label: 'Blue' },
  { value: '#4CAF50', label: 'Green' },
  { value: '#FFD700', label: 'Yellow' },
]
const BRUSH_SIZES = [4, 8, 12]

export function Pictionary({ lang, roomCode, playerId }: PictionaryProps) {
  const { gameState, players } = useGameStore()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawingRef = useRef(false)
  const currentPointsRef = useRef<StrokePoint[]>([])
  const batchTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutSentRef = useRef(false)

  const [selectedColor, setSelectedColor] = useState('#1A1A1A')
  const [brushSize, setBrushSize] = useState(8)
  const [isEraser, setIsEraser] = useState(false)
  const [guess, setGuess] = useState('')

  const data = gameState?.data as PictionaryData | undefined
  const isDrawer = data?.drawer === playerId
  const isGuesser = data?.guesser === playerId
  const phase = data?.phase

  // Reset timeout flag when phase changes to drawing
  useEffect(() => {
    if (phase === 'drawing') {
      timeoutSentRef.current = false
    }
  }, [phase])

  const sendAction = useCallback(
    async (action: Record<string, unknown>) => {
      await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: roomCode, playerId, action }),
      })
    },
    [roomCode, playerId]
  )

  // Timer for drawing phase
  const timer = useTimer({
    duration: 60,
    autoStart: false,
    onExpire: () => {
      if (isDrawer && phase === 'drawing' && !timeoutSentRef.current) {
        timeoutSentRef.current = true
        sendAction({ type: 'pictionary-timeout' })
      }
    },
  })

  // Start/restart timer when a new drawing round begins
  useEffect(() => {
    if (phase === 'drawing' && data?.roundStartedAt) {
      const elapsed = Math.floor((Date.now() - data.roundStartedAt) / 1000)
      const remaining = Math.max(60 - elapsed, 0)
      timer.restart(remaining)
    } else {
      timer.pause()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, data?.roundStartedAt])

  // ─── Canvas Setup ───
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = CANVAS_BG
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [phase])

  // Clear canvas when phase goes to drawing (new round)
  useEffect(() => {
    if (phase === 'drawing') {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.fillStyle = CANVAS_BG
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }, [phase, data?.roundStartedAt])

  // ─── Draw a stroke on canvas ───
  const drawStrokeOnCanvas = useCallback(
    (stroke: Stroke) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx || stroke.points.length < 2) return

      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.width
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
      }
      ctx.stroke()
    },
    []
  )

  // ─── Listen for remote strokes (guesser receives) ───
  useEffect(() => {
    if (isDrawer || phase !== 'drawing') return

    const client = getPusherClient()
    const channelName = `presence-room-${roomCode}`
    const channel = client.channel(channelName)
    if (!channel) return

    const handler = (strokeData: Stroke) => {
      if (strokeData.points.length === 0) {
        // Clear canvas
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.fillStyle = CANVAS_BG
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      } else {
        drawStrokeOnCanvas(strokeData)
      }
    }
    channel.bind('game:draw-stroke', handler)

    return () => {
      channel.unbind('game:draw-stroke', handler)
    }
  }, [isDrawer, phase, roomCode, drawStrokeOnCanvas])

  // ─── Batch send strokes every 100ms ───
  const sendStrokeBatch = useCallback(() => {
    const points = currentPointsRef.current
    if (points.length < 2) return

    const color = isEraser ? CANVAS_BG : selectedColor
    const width = isEraser ? brushSize * 3 : brushSize
    const stroke: Stroke = {
      points: [...points],
      color,
      width,
    }

    // Keep the last point as start of next batch for continuity
    currentPointsRef.current = [points[points.length - 1]]

    fetch('/api/game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: roomCode,
        playerId,
        action: { type: 'draw-stroke', payload: stroke },
      }),
    })
  }, [roomCode, playerId, selectedColor, brushSize, isEraser])

  // ─── Canvas mouse/touch handlers (drawer only) ───
  const getCanvasPoint = useCallback(
    (e: MouseEvent | TouchEvent): StrokePoint | null => {
      const canvas = canvasRef.current
      if (!canvas) return null
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height

      if ('touches' in e) {
        const touch = e.touches[0] || e.changedTouches[0]
        return {
          x: (touch.clientX - rect.left) * scaleX,
          y: (touch.clientY - rect.top) * scaleY,
        }
      }
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      }
    },
    []
  )

  const startDrawing = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDrawer || phase !== 'drawing') return
      e.preventDefault()
      isDrawingRef.current = true
      const point = getCanvasPoint(e)
      if (point) {
        currentPointsRef.current = [point]
      }

      // Start batch timer
      batchTimerRef.current = setInterval(sendStrokeBatch, 100)
    },
    [isDrawer, phase, getCanvasPoint, sendStrokeBatch]
  )

  const draw = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDrawingRef.current || !isDrawer) return
      e.preventDefault()
      const point = getCanvasPoint(e)
      if (!point) return

      currentPointsRef.current.push(point)

      // Draw locally in real-time
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const points = currentPointsRef.current
      if (points.length < 2) return

      const color = isEraser ? CANVAS_BG : selectedColor
      const width = isEraser ? brushSize * 3 : brushSize

      ctx.strokeStyle = color
      ctx.lineWidth = width
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y)
      ctx.lineTo(point.x, point.y)
      ctx.stroke()
    },
    [isDrawer, getCanvasPoint, selectedColor, brushSize, isEraser]
  )

  const stopDrawing = useCallback(() => {
    if (!isDrawingRef.current) return
    isDrawingRef.current = false

    // Clear batch timer and send remaining points
    if (batchTimerRef.current) {
      clearInterval(batchTimerRef.current)
      batchTimerRef.current = null
    }
    sendStrokeBatch()
    currentPointsRef.current = []
  }, [sendStrokeBatch])

  // ─── Attach canvas event listeners ───
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !isDrawer || phase !== 'drawing') return

    const handleMouseDown = (e: MouseEvent) => startDrawing(e)
    const handleMouseMove = (e: MouseEvent) => draw(e)
    const handleMouseUp = () => stopDrawing()
    const handleTouchStart = (e: TouchEvent) => startDrawing(e)
    const handleTouchMove = (e: TouchEvent) => draw(e)
    const handleTouchEnd = () => stopDrawing()

    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd)

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDrawer, phase, startDrawing, draw, stopDrawing])

  // ─── Clear canvas ───
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = CANVAS_BG
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Broadcast a clear stroke (special: empty points array fills bg)
    fetch('/api/game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: roomCode,
        playerId,
        action: {
          type: 'draw-stroke',
          payload: { points: [], color: CANVAS_BG, width: 0 },
        },
      }),
    })
  }, [roomCode, playerId])

  // Clear handler is now integrated in the stroke listener above

  // ─── Submit guess ───
  const handleSubmitGuess = () => {
    const trimmed = guess.trim()
    if (!trimmed || !isGuesser || phase !== 'drawing') return
    sendAction({ type: 'submit-guess', payload: { guess: trimmed } })
    setGuess('')
  }

  // ─── Word display for the drawer ───
  const getWordDisplay = () => {
    if (!data?.word) return ''
    if (lang === 'es') return data.word.es
    return `${data.word.zh} (${data.word.pinyin})`
  }

  // ─── No game state: show start button ───
  if (!gameState) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <h2 className="font-display text-3xl text-shin-black">
          {lang === 'es' ? 'PICTIONARY' : '你画我猜'}
        </h2>
        <p className="text-lg text-center">
          {lang === 'es'
            ? 'Dibuja y adivina palabras!'
            : '画画猜词！'}
        </p>
        <Button variant="primary" size="lg" onClick={() => sendAction({ type: 'start-game', payload: {} })}>
          {lang === 'es' ? 'COMENZAR' : '开始游戏'}
        </Button>
      </div>
    )
  }

  if (!data) return null

  // ─── Finished phase ───
  if (phase === 'finished') {
    const sorted = [...players].sort((a, b) => b.score - a.score)
    const winner = sorted[0]

    return (
      <div className="flex flex-col items-center gap-6 py-4">
        <Onomatopoeia text={lang === 'es' ? 'FIN!' : '结束!'} color="text-shin-red" />
        <Scoreboard players={players} />

        <Card variant="result">
          <h2 className="font-display text-3xl text-shin-yellow mb-4"
            style={{ WebkitTextStroke: '1.5px #1A1A1A', paintOrder: 'stroke fill' }}
          >
            {lang === 'es' ? 'GANADOR' : '获胜者'}
          </h2>
          <p className="font-display text-4xl text-shin-red">
            {winner?.name} {winner?.lang === 'es' ? '🇻🇪' : '🇨🇳'}
          </p>
          <p className="font-display text-2xl text-shin-yellow mt-2">{winner?.score} pts</p>
        </Card>

        <Button
          variant="primary"
          size="lg"
          onClick={() => sendAction({ type: 'start-game', payload: {} })}
        >
          {lang === 'es' ? 'JUGAR DE NUEVO' : '再玩一次'}
        </Button>
      </div>
    )
  }

  // ─── Guessed / Timeout phases (between rounds) ───
  if (phase === 'guessed' || phase === 'timeout') {
    const wordDisplay = data.word
      ? `${data.word.es} / ${data.word.zh} (${data.word.pinyin})`
      : ''
    const isLastRound = data.roundsPlayed >= data.maxRounds

    return (
      <div className="flex flex-col items-center gap-6 py-4">
        {phase === 'guessed' && (
          <Onomatopoeia text="CORRECTO!" color="text-shin-green" rotation={-8} />
        )}
        {phase === 'timeout' && (
          <Onomatopoeia text="TIEMPO!" color="text-shin-red" rotation={5} />
        )}

        <Scoreboard players={players} />

        <Card variant="score">
          <p className="font-display text-lg mb-2">
            {lang === 'es' ? 'La palabra era:' : '答案是：'}
          </p>
          <p className="font-display text-2xl">{wordDisplay}</p>
        </Card>

        <p className="text-sm font-bold">
          {lang === 'es'
            ? `Ronda ${data.roundsPlayed} / ${data.maxRounds}`
            : `第 ${data.roundsPlayed} / ${data.maxRounds} 轮`}
        </p>

        <Button
          variant="secondary"
          size="lg"
          onClick={() =>
            isLastRound
              ? sendAction({ type: 'start-round' })
              : sendAction({ type: 'start-round' })
          }
        >
          {isLastRound
            ? lang === 'es'
              ? 'VER RESULTADOS'
              : '查看结果'
            : lang === 'es'
              ? 'SIGUIENTE RONDA'
              : '下一轮'}
        </Button>
      </div>
    )
  }

  // ─── Drawing phase ───
  return (
    <div className="flex flex-col gap-4">
      {/* Scoreboard */}
      <Scoreboard players={players} activePlayerId={data.drawer} />

      {/* Round info */}
      <div className="text-center text-sm font-bold">
        {lang === 'es'
          ? `Ronda ${data.roundsPlayed + 1} / ${data.maxRounds}`
          : `第 ${data.roundsPlayed + 1} / ${data.maxRounds} 轮`}
      </div>

      {/* Timer */}
      <Timer timeRemaining={timer.timeRemaining} totalTime={60} />

      {/* Word display for drawer */}
      {isDrawer && (
        <Card
          className="bg-shin-yellow text-center border-4 border-shin-black"
        >
          <p className="text-sm font-bold mb-1">
            {lang === 'es' ? 'Dibuja:' : '画这个词：'}
          </p>
          <p className="font-display text-3xl text-shin-black">
            {getWordDisplay()}
          </p>
          <p className="text-xs text-shin-black/60 mt-1">
            {data.word.category}
          </p>
        </Card>
      )}

      {/* Waiting message for guesser */}
      {isGuesser && (
        <Card className="bg-shin-blue text-white text-center border-4 border-shin-black">
          <p className="font-display text-xl">
            {lang === 'es' ? 'ADIVINA EL DIBUJO!' : '猜猜看！'}
          </p>
        </Card>
      )}

      {/* Canvas */}
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="border-4 border-shin-black bg-[#FFFEF0] touch-none"
          style={{
            maxWidth: '100%',
            cursor: isDrawer && phase === 'drawing' ? 'crosshair' : 'default',
          }}
        />
      </div>

      {/* Drawing toolbar (drawer only) */}
      {isDrawer && phase === 'drawing' && (
        <div className="flex flex-wrap items-center justify-center gap-2 bg-white border-3 border-shin-black rounded-lg p-3">
          {/* Colors */}
          {COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => {
                setSelectedColor(c.value)
                setIsEraser(false)
              }}
              className={`w-8 h-8 rounded-full border-3 transition-transform cursor-pointer ${
                selectedColor === c.value && !isEraser
                  ? 'border-shin-red scale-125 shadow-[2px_2px_0_#1A1A1A]'
                  : 'border-shin-black hover:scale-110'
              }`}
              style={{ backgroundColor: c.value }}
              title={c.label}
            />
          ))}

          {/* Divider */}
          <div className="w-px h-8 bg-shin-black/30 mx-1" />

          {/* Eraser */}
          <button
            onClick={() => setIsEraser(!isEraser)}
            className={`px-3 py-1.5 rounded-md border-3 font-bold text-sm cursor-pointer transition-all ${
              isEraser
                ? 'bg-shin-pink text-white border-shin-black shadow-[2px_2px_0_#1A1A1A]'
                : 'bg-white text-shin-black border-shin-black hover:bg-gray-100'
            }`}
          >
            {lang === 'es' ? 'Borrar' : '橡皮'}
          </button>

          {/* Clear */}
          <button
            onClick={clearCanvas}
            className="px-3 py-1.5 rounded-md border-3 border-shin-black bg-shin-red text-white font-bold text-sm cursor-pointer hover:-translate-y-0.5 transition-all active:translate-y-0"
          >
            {lang === 'es' ? 'Limpiar' : '清除'}
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-shin-black/30 mx-1" />

          {/* Brush sizes */}
          {BRUSH_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setBrushSize(size)}
              className={`flex items-center justify-center w-8 h-8 rounded-md border-2 cursor-pointer transition-all ${
                brushSize === size
                  ? 'border-shin-red bg-gray-100 shadow-[1px_1px_0_#E8272A]'
                  : 'border-shin-black/40 hover:border-shin-black'
              }`}
              title={`${size}px`}
            >
              <div
                className="rounded-full bg-shin-black"
                style={{ width: size, height: size }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Guess input (guesser only) */}
      {isGuesser && phase === 'drawing' && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Input
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder={lang === 'es' ? 'Escribe tu respuesta...' : '输入你的答案...'}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmitGuess()
              }}
            />
            <Button
              variant="primary"
              onClick={handleSubmitGuess}
              disabled={!guess.trim()}
            >
              {lang === 'es' ? 'Enviar' : '提交'}
            </Button>
          </div>

          {/* Previous guesses */}
          {data.guesses.length > 0 && (
            <div className="flex flex-col gap-1">
              <p className="text-xs font-bold text-shin-black/50 uppercase">
                {lang === 'es' ? 'Intentos:' : '已猜：'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {data.guesses.map((g, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-shin-cream border-2 border-shin-black/20 rounded text-sm font-bold line-through text-shin-black/50"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
