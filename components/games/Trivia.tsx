'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/lib/store'
import { useTimer } from '@/hooks/useTimer'
import { Timer } from '@/components/ui/Timer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Onomatopoeia } from '@/components/ui/Onomatopoeia'
import type { TriviaData, Lang } from '@/lib/types'

interface TriviaProps {
  lang: Lang
  roomCode: string
  playerId: string
}

export function Trivia({ lang, roomCode, playerId }: TriviaProps) {
  const { gameState, players } = useGameStore()
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showOnomatopoeia, setShowOnomatopoeia] = useState(false)
  const [sending, setSending] = useState(false)
  const hasSubmittedRef = useRef(false)
  const prevQuestionIndexRef = useRef(-1)

  const triviaData = gameState?.data as TriviaData | undefined
  const currentQuestion = triviaData
    ? triviaData.questions[triviaData.currentQuestionIndex]
    : null

  // ─── Send Action Helper ────────────────────────────────────────────────────
  const sendAction = useCallback(
    async (action: any) => {
      await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: roomCode, playerId, action }),
      })
    },
    [roomCode, playerId]
  )

  // ─── Timer ─────────────────────────────────────────────────────────────────
  const submitTimeout = useCallback(() => {
    if (!hasSubmittedRef.current) {
      hasSubmittedRef.current = true
      sendAction({ type: 'submit-answer', payload: { answer: -1, timeRemaining: 0 } })
    }
  }, [sendAction])

  const { timeRemaining, restart } = useTimer({
    duration: currentQuestion?.timerSeconds ?? 15,
    autoStart: triviaData?.phase === 'question',
    onExpire: submitTimeout,
  })

  // Reset state when question changes
  useEffect(() => {
    if (
      triviaData &&
      triviaData.phase === 'question' &&
      triviaData.currentQuestionIndex !== prevQuestionIndexRef.current
    ) {
      prevQuestionIndexRef.current = triviaData.currentQuestionIndex
      setSelectedAnswer(null)
      hasSubmittedRef.current = false
      setShowOnomatopoeia(false)
      const q = triviaData.questions[triviaData.currentQuestionIndex]
      if (q) restart(q.timerSeconds)
    }
  }, [triviaData?.currentQuestionIndex, triviaData?.phase, restart, triviaData])

  // Show onomatopoeia on reveal phase
  useEffect(() => {
    if (triviaData?.phase === 'reveal') {
      setShowOnomatopoeia(true)
    }
  }, [triviaData?.phase])

  // Fix race condition: if both answered but phase is still 'question', force reveal
  useEffect(() => {
    if (!triviaData || triviaData.phase !== 'question') return
    const allAnswered = players.length === 2 && players.every((p) => triviaData.answers[p.id])
    if (allAnswered) {
      sendAction({ type: 'force-reveal' })
    }
  }, [triviaData, players, sendAction])

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleStartGame = () => {
    sendAction({ type: 'start-game', payload: {} })
  }

  const handleSelectAnswer = (index: number) => {
    if (selectedAnswer !== null || hasSubmittedRef.current) return
    setSelectedAnswer(index)
    hasSubmittedRef.current = true
    sendAction({
      type: 'submit-answer',
      payload: { answer: index, timeRemaining },
    })
  }

  const handleNextQuestion = async () => {
    if (sending) return
    setSending(true)
    await sendAction({ type: 'next-question' })
    setSending(false)
  }

  // ─── Pre-game: No gameState ────────────────────────────────────────────────
  if (!gameState || !triviaData) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-12">
        <div className="text-center">
          <h2 className="font-display text-4xl text-shin-red mb-2">
            {lang === 'es' ? 'TRIVIA' : '问答游戏'}
          </h2>
          <p className="text-lg text-shin-black/70">
            {lang === 'es'
              ? '¡Responde preguntas sobre cultura y vocabulario!'
              : '回答文化和词汇问题!'}
          </p>
        </div>
        <div className="animate-shin-bounce">
          <span className="text-6xl">🧠</span>
        </div>
        <Button variant="primary" size="lg" onClick={handleStartGame}>
          {lang === 'es' ? '¡COMENZAR!' : '开始!'}
        </Button>
      </div>
    )
  }

  // ─── Finished Phase ────────────────────────────────────────────────────────
  if (triviaData.phase === 'finished') {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
    const winner = sortedPlayers[0]
    const isTie = sortedPlayers.length > 1 && sortedPlayers[0].score === sortedPlayers[1].score
    const iWon = !isTie && winner?.id === playerId
    const iLost = !isTie && winner?.id !== playerId

    const onomatopoeiaText = isTie
      ? (lang === 'es' ? '¡EMPATE!' : '平局!')
      : iWon
        ? (lang === 'es' ? '¡GANASTE!' : '你赢了!')
        : (lang === 'es' ? '¡PERDISTE!' : '你输了!')

    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <Onomatopoeia
          text={onomatopoeiaText}
          color={iWon ? 'text-shin-green' : iLost ? 'text-shin-red' : 'text-shin-yellow'}
          size="text-6xl"
          duration={3000}
        />

        <Card variant="result" className="w-full max-w-md text-center">
          <h2 className="font-display text-3xl text-shin-red mb-4">
            {lang === 'es' ? '¡RESULTADOS!' : '结果!'}
          </h2>

          {isTie ? (
            <p className="font-display text-2xl text-shin-blue mb-4">
              {lang === 'es' ? '¡Es un empate!' : '平局!'}
            </p>
          ) : (
            <div className="mb-4">
              <span className="text-5xl mb-2 block">{iWon ? '🏆' : '😭'}</span>
              <p className="font-display text-2xl text-shin-blue">
                {iWon
                  ? (lang === 'es' ? '¡Felicidades, ganaste!' : '恭喜你赢了!')
                  : (lang === 'es' ? `${winner?.name} gano` : `${winner?.name} 赢了`)}
              </p>
            </div>
          )}

          <div className="flex justify-center gap-8 mt-4">
            {sortedPlayers.map((p) => (
              <div key={p.id} className="text-center">
                <p className="font-bold">{p.name}</p>
                <p className="font-display text-3xl text-shin-yellow">
                  {p.score}
                </p>
                <p className="text-xs text-shin-black/50">
                  {lang === 'es' ? 'puntos' : '分'}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Button variant="secondary" size="lg" onClick={handleStartGame}>
          {lang === 'es' ? '¡JUGAR DE NUEVO!' : '再玩一次!'}
        </Button>
      </div>
    )
  }

  if (!currentQuestion) return null

  const myAnswer = triviaData.answers[playerId]
  const hasAnswered = myAnswer !== undefined && myAnswer !== null
  const isReveal = triviaData.phase === 'reveal'

  // Check if answer was correct (for reveal phase)
  const wasCorrect = hasAnswered && myAnswer.answer === currentQuestion.correctIndex

  // ─── Question / Reveal Phase ───────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="flex items-center justify-between px-2">
        <span className="font-display text-sm text-shin-black/60">
          {lang === 'es' ? 'Pregunta' : '问题'}{' '}
          {triviaData.currentQuestionIndex + 1} / {triviaData.questions.length}
        </span>
        <span className="text-xs bg-shin-blue/10 text-shin-blue px-2 py-1 rounded-full font-bold border-2 border-shin-blue/30">
          {currentQuestion.category}
        </span>
      </div>

      {/* Timer */}
      {triviaData.phase === 'question' && (
        <Timer
          timeRemaining={timeRemaining}
          totalTime={currentQuestion.timerSeconds}
        />
      )}

      {/* Question Card */}
      <Card variant="question" className="border-shin-blue">
        <p className="font-display text-xl md:text-2xl text-shin-black leading-tight mb-2">
          {currentQuestion.question.es}
        </p>
        <p className="text-lg text-shin-blue/80 font-medium">
          {currentQuestion.question.zh}
        </p>
      </Card>

      {/* Options Grid */}
      <div className="grid grid-cols-2 gap-3">
        {currentQuestion.options.map((option, index) => {
          const isCorrect = index === currentQuestion.correctIndex
          const isSelected = selectedAnswer === index

          let optionStyle = ''
          let animation = ''

          if (isReveal) {
            if (isCorrect) {
              optionStyle =
                'bg-shin-green text-white border-shin-green shadow-[0_0_20px_rgba(76,175,80,0.5)]'
              animation = 'animate-shin-bounce'
            } else if (isSelected && !isCorrect) {
              optionStyle = 'bg-shin-red/80 text-white border-shin-red'
              animation = 'animate-shin-shake'
            } else {
              optionStyle = 'bg-gray-100 text-shin-black/40 border-gray-300'
            }
          } else if (isSelected) {
            optionStyle = 'bg-shin-blue text-white border-shin-blue'
          } else {
            optionStyle =
              'bg-white text-shin-black border-shin-black hover:-translate-y-1 hover:shadow-[4px_4px_0_#1A1A1A] cursor-pointer'
          }

          return (
            <button
              key={index}
              onClick={() => handleSelectAnswer(index)}
              disabled={hasAnswered || isReveal}
              className={`
                p-4 rounded-xl border-3 font-bold transition-all duration-200
                ${optionStyle} ${animation}
                disabled:cursor-default
              `}
            >
              <span className="block text-base md:text-lg">{option.es}</span>
              <span className="block text-sm opacity-80 mt-1">{option.zh}</span>
            </button>
          )
        })}
      </div>

      {/* Waiting indicator */}
      {triviaData.phase === 'question' && hasAnswered && (
        <div className="text-center py-3">
          <p className="text-shin-black/60 font-bold animate-pulse">
            {lang === 'es'
              ? '¡Esperando al otro jugador...'
              : '等待其他玩家...'}
          </p>
          <span className="text-3xl animate-shin-wiggle inline-block mt-1">
            ⏳
          </span>
        </div>
      )}

      {/* Reveal Phase: Onomatopoeia + Explanation */}
      {isReveal && (
        <>
          {showOnomatopoeia && (
            <Onomatopoeia
              text={wasCorrect ? (lang === 'es' ? '¡CORRECTO!' : '正确!') : (lang === 'es' ? '¡INCORRECTO!' : '错误!')}
              color={wasCorrect ? 'text-shin-green' : 'text-shin-red'}
              size="text-5xl"
              rotation={wasCorrect ? -5 : 5}
            />
          )}

          {/* Explanation Card */}
          <Card
            variant="game"
            className="animate-shin-pop bg-shin-cream border-shin-yellow"
          >
            <p className="font-display text-lg text-shin-black mb-1">
              {lang === 'es' ? '¿Por que?' : '为什么?'}
            </p>
            <p className="text-shin-black/80">{currentQuestion.explanation.es}</p>
            <p className="text-shin-blue/70 text-sm mt-1">
              {currentQuestion.explanation.zh}
            </p>
          </Card>

          {/* Player answers summary */}
          <div className="flex justify-center gap-4">
            {players.map((player) => {
              const pAnswer = triviaData.answers[player.id]
              const pCorrect =
                pAnswer && pAnswer.answer === currentQuestion.correctIndex
              const flag = player.lang === 'es' ? '🇻🇪' : '🇨🇳'

              return (
                <div
                  key={player.id}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg border-2
                    ${pCorrect ? 'border-shin-green bg-shin-green/10' : 'border-shin-red bg-shin-red/10'}
                  `}
                >
                  <span>{flag}</span>
                  <span className="font-bold text-sm">{player.name}</span>
                  <span>{pCorrect ? '✅' : '❌'}</span>
                  {pAnswer && pAnswer.answer !== -1 && (
                    <span className="text-xs text-shin-black/50">
                      {pAnswer.timeRemaining}s
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Next button */}
          <div className="flex justify-center mt-2">
            <Button variant="secondary" size="lg" onClick={handleNextQuestion} disabled={sending}>
              {triviaData.currentQuestionIndex <
              triviaData.questions.length - 1
                ? lang === 'es'
                  ? 'SIGUIENTE →'
                  : '下一题 →'
                : lang === 'es'
                  ? 'VER RESULTADOS'
                  : '查看结果'}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
