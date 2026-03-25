'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Onomatopoeia } from '@/components/ui/Onomatopoeia'
import type { MemoryData, MemoryCard as MemoryCardType, Lang } from '@/lib/types'
import { memoryDeckNames, memoryDeckLabels } from '@/lib/gameData'

interface MemoryProps {
  lang: Lang
  roomCode: string
  playerId: string
}

export function Memory({ lang, roomCode, playerId }: MemoryProps) {
  const { gameState, players, selectedDeck: storeDeck } = useGameStore()
  const selectedDeck = storeDeck || memoryDeckNames[0]
  const [lastMatchedPairCount, setLastMatchedPairCount] = useState(0)
  const [showMatchOnomatopoeia, setShowMatchOnomatopoeia] = useState(false)
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const memoryData = gameState?.data as MemoryData | undefined

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

  // ─── Mismatch Reset Logic ─────────────────────────────────────────────────
  useEffect(() => {
    if (!memoryData || memoryData.phase !== 'playing') return
    if (memoryData.flippedIndices.length !== 2) return
    if (memoryData.activePlayer !== playerId) return

    const [i1, i2] = memoryData.flippedIndices
    const card1 = memoryData.cards[i1]
    const card2 = memoryData.cards[i2]

    // If they match, the server handles it — no reset needed
    if (card1.pairId === card2.pairId) return

    // Mismatch: wait 1.5s then send reset
    resetTimeoutRef.current = setTimeout(() => {
      sendAction({ type: 'reset-flipped' })
    }, 1500)

    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current)
        resetTimeoutRef.current = null
      }
    }
  }, [memoryData?.flippedIndices, memoryData?.phase, memoryData?.activePlayer, memoryData?.cards, playerId, sendAction, memoryData])

  // ─── Detect New Match for Onomatopoeia ─────────────────────────────────────
  useEffect(() => {
    if (!memoryData) return
    const currentCount = memoryData.matchedPairIds.length
    if (currentCount > lastMatchedPairCount && lastMatchedPairCount > 0) {
      setShowMatchOnomatopoeia(true)
      const timer = setTimeout(() => setShowMatchOnomatopoeia(false), 1500)
      return () => clearTimeout(timer)
    }
    setLastMatchedPairCount(currentCount)
  }, [memoryData?.matchedPairIds.length, lastMatchedPairCount, memoryData])

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleSelectDeck = (deck: string) => {
    sendAction({ type: 'select-deck', payload: { deckName: deck } })
  }

  const handleStartGame = () => {
    sendAction({ type: 'start-game', payload: { deckName: selectedDeck } })
  }

  const handleFlipCard = (cardIndex: number) => {
    if (!memoryData) return
    if (memoryData.activePlayer !== playerId) return
    if (memoryData.flippedIndices.length >= 2) return
    if (memoryData.flippedIndices.includes(cardIndex)) return
    if (memoryData.cards[cardIndex].isMatched) return

    sendAction({ type: 'flip-card', payload: { cardIndex } })
  }

  // ─── Pre-game: Deck Selection ──────────────────────────────────────────────
  if (!gameState || !memoryData) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-12">
        <div className="text-center">
          <h2 className="font-display text-4xl text-shin-purple mb-2">
            {lang === 'es' ? 'MEMORIA' : '记忆游戏'}
          </h2>
          <p className="text-lg text-shin-black/70">
            {lang === 'es'
              ? '¡Encuentra los pares de palabras!'
              : '找到配对的单词!'}
          </p>
        </div>

        <div className="animate-shin-bounce">
          <span className="text-6xl">🃏</span>
        </div>

        {/* Deck Selector */}
        <Card variant="game" className="w-full max-w-sm">
          <p className="font-display text-lg text-shin-black mb-3 text-center">
            {lang === 'es' ? 'Elige un tema:' : '选择主题:'}
          </p>
          <div className="flex flex-col gap-2">
            {memoryDeckNames.map((deck) => (
              <button
                key={deck}
                onClick={() => handleSelectDeck(deck)}
                className={`
                  px-4 py-3 rounded-lg border-3 font-bold text-left transition-all duration-150
                  ${
                    selectedDeck === deck
                      ? 'bg-shin-purple text-white border-shin-purple shadow-[3px_3px_0_#1A1A1A]'
                      : 'bg-white text-shin-black border-shin-black hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#1A1A1A]'
                  }
                `}
              >
                {memoryDeckLabels[deck]?.[lang] ?? deck}
              </button>
            ))}
          </div>
        </Card>

        <Button variant="primary" size="lg" onClick={handleStartGame}>
          {lang === 'es' ? '¡COMENZAR!' : '开始!'}
        </Button>
      </div>
    )
  }

  // ─── Finished Phase ────────────────────────────────────────────────────────
  if (memoryData.phase === 'finished') {
    const sortedPlayers = [...players].sort(
      (a, b) => (memoryData.pairsFound[b.id] ?? 0) - (memoryData.pairsFound[a.id] ?? 0)
    )
    const topScore = memoryData.pairsFound[sortedPlayers[0]?.id] ?? 0
    const secondScore = memoryData.pairsFound[sortedPlayers[1]?.id] ?? 0
    const isTie = sortedPlayers.length > 1 && topScore === secondScore
    const winner = sortedPlayers[0]

    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <Onomatopoeia
          text={isTie ? '¡EMPATE!' : '¡VICTORIA!'}
          color="text-shin-purple"
          size="text-6xl"
          duration={3000}
        />

        <Card variant="result" className="w-full max-w-md text-center">
          <h2 className="font-display text-3xl text-shin-purple mb-4">
            {lang === 'es' ? '¡RESULTADOS!' : '结果!'}
          </h2>

          {isTie ? (
            <p className="font-display text-2xl text-shin-blue mb-4">
              {lang === 'es' ? '¡Es un empate!' : '平局!'}
            </p>
          ) : (
            <div className="mb-4">
              <span className="text-5xl mb-2 block">🏆</span>
              <p className="font-display text-2xl text-shin-purple">
                {winner?.name}
              </p>
              <p className="text-sm text-shin-black/60">
                {winner?.lang === 'es' ? '🇻🇪' : '🇨🇳'}
              </p>
            </div>
          )}

          <div className="flex justify-center gap-8 mt-4">
            {sortedPlayers.map((p) => (
              <div key={p.id} className="text-center">
                <p className="font-bold">{p.name}</p>
                <p className="font-display text-3xl text-shin-yellow">
                  {memoryData.pairsFound[p.id] ?? 0}
                </p>
                <p className="text-xs text-shin-black/50">
                  {lang === 'es' ? 'pares' : '对'}
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

  // ─── Playing Phase ─────────────────────────────────────────────────────────
  const isMyTurn = memoryData.activePlayer === playerId
  const activePlayerData = players.find((p) => p.id === memoryData.activePlayer)
  const activeFlag = activePlayerData?.lang === 'es' ? '🇻🇪' : '🇨🇳'

  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto">
      {/* Match onomatopoeia */}
      {showMatchOnomatopoeia && (
        <Onomatopoeia
          text={lang === 'es' ? '¡PAR!' : '配对!'}
          color="text-shin-green"
          size="text-5xl"
          duration={1500}
        />
      )}

      {/* Turn Indicator + Scores */}
      <div className="flex items-center justify-between px-2">
        <div
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg border-3
            ${isMyTurn ? 'bg-shin-yellow border-shin-black animate-shin-wiggle' : 'bg-gray-100 border-gray-300'}
          `}
        >
          <span>{activeFlag}</span>
          <span className="font-display text-sm">
            {isMyTurn
              ? lang === 'es'
                ? '¡TU TURNO!'
                : '你的回合!'
              : lang === 'es'
                ? `Turno de ${activePlayerData?.name}`
                : `${activePlayerData?.name}的回合`}
          </span>
        </div>

        <div className="flex gap-4">
          {players.map((p) => {
            const flag = p.lang === 'es' ? '🇻🇪' : '🇨🇳'
            return (
              <div
                key={p.id}
                className="flex items-center gap-1.5 bg-shin-black text-white px-3 py-1.5 rounded-lg"
              >
                <span className="text-sm">{flag}</span>
                <span className="font-bold text-sm">{p.name}</span>
                <span className="font-display text-lg text-shin-yellow">
                  {memoryData.pairsFound[p.id] ?? 0}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Deck name */}
      <p className="text-center text-sm text-shin-black/50 font-bold">
        {memoryDeckLabels[memoryData.deckName]?.[lang] ?? memoryData.deckName}
      </p>

      {/* Card Grid */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-1.5 md:gap-2">
        {memoryData.cards.map((card, index) => {
          const isFlipped = memoryData.flippedIndices.includes(index)
          const isMatched = card.isMatched
          const isRevealed = isFlipped || isMatched
          const canClick =
            isMyTurn &&
            !isRevealed &&
            memoryData.flippedIndices.length < 2

          return (
            <MemoryCardComponent
              key={card.id}
              card={card}
              isRevealed={isRevealed}
              isMatched={isMatched}
              canClick={canClick}
              onClick={() => handleFlipCard(index)}
            />
          )
        })}
      </div>

      {/* Progress */}
      <div className="text-center text-sm text-shin-black/50">
        {memoryData.matchedPairIds.length} / {memoryData.cards.length / 2}{' '}
        {lang === 'es' ? 'pares encontrados' : '对已找到'}
      </div>
    </div>
  )
}

// ─── Memory Card Sub-component ─────────────────────────────────────────────

interface MemoryCardComponentProps {
  card: MemoryCardType
  isRevealed: boolean
  isMatched: boolean
  canClick: boolean
  onClick: () => void
}

function MemoryCardComponent({
  card,
  isRevealed,
  isMatched,
  canClick,
  onClick,
}: MemoryCardComponentProps) {
  return (
    <button
      onClick={onClick}
      disabled={!canClick}
      className="relative w-full aspect-square [perspective:600px]"
      aria-label={isRevealed ? card.text : 'Hidden card'}
    >
      <div
        className={`
          relative w-full h-full transition-transform duration-500
          [transform-style:preserve-3d]
          ${isRevealed ? '[transform:rotateY(180deg)]' : ''}
        `}
      >
        {/* Back face (hidden card) */}
        <div
          className={`
            absolute inset-0 [backface-visibility:hidden]
            rounded-lg border-3 border-shin-black
            flex items-center justify-center
            transition-all duration-150
            ${
              canClick
                ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#1A1A1A] active:translate-y-0'
                : 'cursor-default'
            }
          `}
          style={{
            backgroundColor: '#7B2D8B',
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.15) 2px, transparent 2px),
              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 3px, transparent 3px),
              radial-gradient(circle at 25% 75%, rgba(255,255,255,0.12) 1.5px, transparent 1.5px),
              radial-gradient(circle at 75% 25%, rgba(255,255,255,0.12) 1.5px, transparent 1.5px)
            `,
          }}
        >
          <span className="text-2xl md:text-3xl select-none">&#9733;</span>
        </div>

        {/* Front face (revealed card) */}
        <div
          className={`
            absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]
            rounded-lg flex flex-col items-center justify-center p-1
            ${isMatched ? 'animate-shin-wiggle' : ''}
            ${
              isMatched
                ? 'bg-shin-green/20 border-4 border-shin-green'
                : card.lang === 'es'
                  ? 'bg-white border-4 border-shin-blue'
                  : 'bg-white border-4 border-shin-red'
            }
          `}
        >
          {card.lang === 'zh' ? (
            <>
              <span
                className="text-lg md:text-2xl font-bold leading-tight text-center"
                style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
              >
                {card.text}
              </span>
              <span className="text-[10px] md:text-xs text-shin-black/50 font-mono mt-0.5 text-center leading-tight">
                {card.pinyin}
              </span>
            </>
          ) : (
            <span className="text-sm md:text-base font-bold text-center leading-tight font-body">
              {card.text}
            </span>
          )}

          {isMatched && (
            <span className="absolute top-0.5 right-0.5 text-xs">✅</span>
          )}
        </div>
      </div>
    </button>
  )
}
