'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/lib/store'
import { useTimer } from '@/hooks/useTimer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Timer } from '@/components/ui/Timer'
import { Onomatopoeia } from '@/components/ui/Onomatopoeia'
import { Scoreboard } from '@/components/ui/Scoreboard'
import type { Lang, EmojiCharadesData } from '@/lib/types'

interface EmojiCharadesProps {
  lang: Lang
  roomCode: string
  playerId: string
}

const EMOJI_PALETTE = [
  // People & Gestures
  '😀', '😂', '😍', '😢', '😡', '🤔', '😱', '🤮', '😴', '🤯',
  '👶', '👦', '👧', '👨', '👩', '👴', '👵', '🤴', '👸', '🧙',
  '👉', '👆', '👇', '🤝', '👏', '💪', '🙏', '💃', '🕺', '🏃',
  // Animals
  '🐶', '🐱', '🐭', '🐰', '🦊', '🐻', '🐼', '🐸', '🐵', '🦁',
  '🐯', '🐮', '🐷', '🐔', '🐧', '🐦', '🦅', '🐍', '🐢', '🐙',
  '🦈', '🐬', '🐳', '🦋', '🐝',
  // Food & Drink
  '🍕', '🍔', '🌮', '🍣', '🍜', '🍦', '🎂', '🍫', '☕', '🍺',
  '🍷', '🥤', '🍌', '🍎', '🍉', '🥑', '🌶️', '🍗', '🧀', '🍿',
  // Nature & Weather
  '🌞', '🌙', '⭐', '🌈', '🌧️', '❄️', '🔥', '💧', '🌊', '🌺',
  '🌳', '🌵', '🍄', '🌋', '⛰️',
  // Objects
  '🏠', '🏰', '🏥', '✈️', '🚗', '🚢', '🚀', '🎸', '🎹', '📱',
  '💻', '📷', '🔑', '💰', '💎', '🎁', '📚', '🔫', '💣', '🗡️',
  // Symbols & Activities
  '❤️', '💔', '💀', '👻', '🎃', '🎄', '🎉', '🎬', '🎮', '🏆',
  '⚽', '🏀', '🎯', '🎭', '👑', '💍', '🔔', '⏰', '🌍', '🗺️',
  // Transport & Places
  '🏖️', '🎢', '🎪', '⛪', '🕌', '🗽', '🗼',
]

export function EmojiCharades({ lang, roomCode, playerId }: EmojiCharadesProps) {
  const { gameState, players } = useGameStore()
  const [guess, setGuess] = useState('')
  const [sending, setSending] = useState(false)
  const timeoutSentRef = useRef(false)

  const data = gameState?.data as EmojiCharadesData | undefined
  const phase = data?.phase
  const isPrompter = data?.prompter === playerId
  const isGuesser = data?.guesser === playerId
  const prompterPlayer = players.find((p) => p.id === data?.prompter)
  const guesserPlayer = players.find((p) => p.id === data?.guesser)

  const sendAction = useCallback(
    async (action: Record<string, unknown>) => {
      if (sending) return
      setSending(true)
      await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: roomCode, playerId, action }),
      })
      setSending(false)
    },
    [roomCode, playerId, sending]
  )

  // Reset timeout flag on new round
  useEffect(() => {
    if (phase === 'prompting') {
      timeoutSentRef.current = false
      setGuess('')
    }
  }, [phase, data?.roundStartedAt])

  const timer = useTimer({
    duration: 45,
    autoStart: false,
    onExpire: () => {
      if (isPrompter && phase === 'prompting' && !timeoutSentRef.current) {
        timeoutSentRef.current = true
        sendAction({ type: 'emoji-timeout' })
      }
    },
  })

  useEffect(() => {
    if (phase === 'prompting' && data?.roundStartedAt) {
      const elapsed = Math.floor((Date.now() - data.roundStartedAt) / 1000)
      const remaining = Math.max(45 - elapsed, 0)
      timer.restart(remaining)
    } else {
      timer.pause()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, data?.roundStartedAt])

  const handleSendEmoji = (emoji: string) => {
    if (!isPrompter || phase !== 'prompting') return
    sendAction({ type: 'send-emoji', payload: { emoji } })
  }

  const handleSubmitGuess = () => {
    const trimmed = guess.trim()
    if (!trimmed || !isGuesser || phase !== 'prompting') return
    sendAction({ type: 'emoji-guess', payload: { guess: trimmed } })
    setGuess('')
  }

  // ─── No game state ───
  if (!gameState) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <h2 className="font-display text-3xl text-shin-black">
          {lang === 'es' ? 'EMOJI CHARADES' : '表情猜词'}
        </h2>
        <div className="text-6xl animate-shin-bounce">🎭</div>
        <p className="text-lg text-center text-shin-black/70 max-w-sm">
          {lang === 'es'
            ? 'Describe la palabra usando SOLO emojis. La otra jugadora adivina!'
            : '只用表情符号描述这个词。让另一个玩家猜！'}
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={() => sendAction({ type: 'start-game', payload: {} })}
        >
          {lang === 'es' ? 'COMENZAR' : '开始游戏'}
        </Button>
      </div>
    )
  }

  if (!data) return null

  // ─── Finished ───
  if (phase === 'finished') {
    const sorted = [...players].sort((a, b) => b.score - a.score)
    const winner = sorted[0]
    const isTie = sorted.length > 1 && sorted[0].score === sorted[1].score
    const iWon = !isTie && winner?.id === playerId

    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <Onomatopoeia
          text={isTie ? (lang === 'es' ? '¡EMPATE!' : '平局!') : iWon ? (lang === 'es' ? '¡GANASTE!' : '你赢了!') : (lang === 'es' ? '¡PERDISTE!' : '你输了!')}
          color={iWon ? 'text-shin-green' : isTie ? 'text-shin-yellow' : 'text-shin-red'}
          size="text-6xl"
          duration={3000}
        />
        <Card variant="result" className="w-full max-w-md text-center">
          <h2 className="font-display text-3xl text-shin-red mb-4">
            {lang === 'es' ? '¡RESULTADOS!' : '结果!'}
          </h2>
          <div className="text-5xl mb-2">{iWon ? '🏆' : isTie ? '🤝' : '😭'}</div>
          <div className="flex justify-center gap-8 mt-4">
            {sorted.map((p) => (
              <div key={p.id} className="text-center">
                <p className="font-bold">{p.name}</p>
                <p className="font-display text-3xl text-shin-yellow">{p.score}</p>
              </div>
            ))}
          </div>
        </Card>
        <Button variant="secondary" size="lg" onClick={() => sendAction({ type: 'start-game', payload: {} })}>
          {lang === 'es' ? '¡JUGAR DE NUEVO!' : '再玩一次!'}
        </Button>
      </div>
    )
  }

  // ─── Guessed / Timeout (between rounds) ───
  if (phase === 'guessed' || phase === 'timeout') {
    const wordDisplay = data.currentPrompt
      ? `${data.currentPrompt.es} / ${data.currentPrompt.zh}`
      : ''
    const isLastRound = data.roundsPlayed >= data.maxRounds

    return (
      <div className="flex flex-col items-center gap-5 py-4">
        {phase === 'guessed' && (
          <Onomatopoeia text={lang === 'es' ? '¡CORRECTO!' : '正确!'} color="text-shin-green" rotation={-8} />
        )}
        {phase === 'timeout' && (
          <Onomatopoeia text={lang === 'es' ? '¡TIEMPO!' : '时间到!'} color="text-shin-red" rotation={5} />
        )}

        <Scoreboard players={players} />

        {/* Emoji clue recap */}
        {data.emojis.length > 0 && (
          <div className="text-4xl bg-white border-3 border-shin-black rounded-xl px-4 py-3 shadow-[4px_4px_0_#1A1A1A]">
            {data.emojis.join(' ')}
          </div>
        )}

        <Card variant="score">
          <p className="font-display text-base mb-1">
            {lang === 'es' ? 'La respuesta era:' : '答案是：'}
          </p>
          <p className="font-display text-2xl">{wordDisplay}</p>
          <p className="text-xs text-shin-black/50 mt-1">{data.currentPrompt?.category}</p>
        </Card>

        <p className="text-sm font-bold">
          {lang === 'es'
            ? `Ronda ${data.roundsPlayed} / ${data.maxRounds}`
            : `第 ${data.roundsPlayed} / ${data.maxRounds} 轮`}
        </p>

        <Button
          variant="secondary"
          size="lg"
          onClick={() => sendAction(isLastRound ? { type: 'next-emoji-round' } : { type: 'next-emoji-round' })}
          disabled={sending}
        >
          {isLastRound
            ? lang === 'es' ? 'VER RESULTADOS' : '查看结果'
            : lang === 'es' ? 'SIGUIENTE RONDA' : '下一轮'}
        </Button>
      </div>
    )
  }

  // ─── Prompting phase ───
  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
      <Scoreboard players={players} activePlayerId={data.prompter} />

      <div className="text-center text-sm font-bold">
        {lang === 'es'
          ? `Ronda ${data.roundsPlayed + 1} / ${data.maxRounds}`
          : `第 ${data.roundsPlayed + 1} / ${data.maxRounds} 轮`}
      </div>

      <Timer timeRemaining={timer.timeRemaining} totalTime={45} />

      {/* Role indicator */}
      <div className={`rounded-xl border-3 border-shin-black px-4 py-3 text-center ${
        isPrompter ? 'bg-shin-yellow shadow-[4px_4px_0_#1A1A1A]' : 'bg-shin-blue text-white'
      }`}>
        <p className="font-display text-lg">
          {isPrompter
            ? lang === 'es' ? '🎭 TU TURNO: DESCRIBE CON EMOJIS' : '🎭 你的回合：用表情描述'
            : lang === 'es' ? `🤔 ${prompterPlayer?.name} ESTA DESCRIBIENDO...` : `🤔 ${prompterPlayer?.name} 正在描述...`}
        </p>
      </div>

      {/* Word to describe (prompter only) */}
      {isPrompter && data.currentPrompt && (
        <div className="bg-shin-red text-white text-center border-4 border-shin-black rounded-xl p-4 shadow-[4px_4px_0_#1A1A1A] animate-shin-pop">
          <p className="text-xs font-bold opacity-70 mb-1">
            {lang === 'es' ? 'Describe esta palabra:' : '描述这个词：'}
          </p>
          <p className="font-display text-3xl">
            {lang === 'es' ? data.currentPrompt.es : data.currentPrompt.zh}
          </p>
          <p className="text-xs opacity-60 mt-1">{data.currentPrompt.category}</p>
        </div>
      )}

      {/* Emoji display area */}
      <div className="bg-white border-4 border-shin-black rounded-xl min-h-[80px] flex items-center justify-center px-4 py-3 shadow-[4px_4px_0_#1A1A1A]">
        {data.emojis.length === 0 ? (
          <p className="text-shin-black/30 font-bold">
            {isPrompter
              ? lang === 'es' ? 'Selecciona emojis abajo...' : '在下面选择表情...'
              : lang === 'es' ? 'Esperando emojis...' : '等待表情...'}
          </p>
        ) : (
          <div className="text-4xl md:text-5xl tracking-wider">
            {data.emojis.join(' ')}
          </div>
        )}
      </div>

      {/* Emoji palette (prompter only) */}
      {isPrompter && phase === 'prompting' && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-shin-black/50">
              {data.emojis.length}/8 emojis
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => sendAction({ type: 'clear-emojis' })}
              disabled={data.emojis.length === 0 || sending}
            >
              🗑️ {lang === 'es' ? 'Limpiar' : '清除'}
            </Button>
          </div>
          <div className="grid grid-cols-10 md:grid-cols-15 gap-1 bg-white border-3 border-shin-black rounded-xl p-2 max-h-48 overflow-y-auto">
            {EMOJI_PALETTE.map((emoji, i) => (
              <button
                key={i}
                onClick={() => handleSendEmoji(emoji)}
                disabled={data.emojis.length >= 8 || sending}
                className="text-2xl p-1 rounded-lg hover:bg-shin-cream active:scale-90 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Guess input (guesser only) */}
      {isGuesser && phase === 'prompting' && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Input
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder={lang === 'es' ? '¿Que es? Escribe tu respuesta...' : '是什么？写下你的答案...'}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmitGuess()
              }}
            />
            <Button variant="primary" onClick={handleSubmitGuess} disabled={!guess.trim() || sending}>
              {lang === 'es' ? 'Adivinar' : '猜'}
            </Button>
          </div>

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
