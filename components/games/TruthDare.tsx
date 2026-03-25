'use client'

import { useState, useCallback } from 'react'
import { useGameStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Scoreboard } from '@/components/ui/Scoreboard'
import { DifficultyBadge } from '@/components/ui/Badge'
import { Onomatopoeia } from '@/components/ui/Onomatopoeia'
import { SpinnerWheel } from './SpinnerWheel'
import { TranslationChat } from '@/components/ui/TranslationChat'
import type { Lang, TruthDareData } from '@/lib/types'

interface TruthDareProps {
  lang: Lang
  roomCode: string
  playerId: string
}

function TurnBanner({ playerName, flag, text, isMe }: { playerName: string; flag: string; text: string; isMe: boolean }) {
  return (
    <div
      className={`w-full max-w-md mx-auto rounded-xl border-3 border-shin-black px-4 py-3 flex items-center gap-3 ${
        isMe
          ? 'bg-shin-yellow shadow-[4px_4px_0_#1A1A1A] animate-shin-wiggle'
          : 'bg-white'
      }`}
    >
      <span className="text-2xl">{flag}</span>
      <div>
        <p className="font-display text-lg leading-tight">{playerName}</p>
        <p className={`text-xs font-bold ${isMe ? 'text-shin-red' : 'text-shin-black/50'}`}>{text}</p>
      </div>
      {isMe && <span className="ml-auto text-2xl animate-shin-bounce">👈</span>}
    </div>
  )
}

export function TruthDare({ lang, roomCode, playerId }: TruthDareProps) {
  const { gameState, players } = useGameStore()
  const [spinDone, setSpinDone] = useState(false)
  const [sending, setSending] = useState(false)

  const data = gameState?.data as TruthDareData | undefined
  const phase = data?.phase

  const isChosen = data?.chosenPlayer === playerId
  const chosenPlayer = players.find((p) => p.id === data?.chosenPlayer)
  const otherPlayer = players.find((p) => p.id !== data?.chosenPlayer)
  const myName = players.find((p) => p.id === playerId)?.name || ''
  const myFlag = players.find((p) => p.id === playerId)?.lang === 'es' ? '🇻🇪' : '🇨🇳'

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

  // ─── No game state ───
  if (!gameState) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <h2 className="font-display text-3xl text-shin-black">
          {lang === 'es' ? 'VERDAD O RETO' : '真心话大冒险'}
        </h2>
        <div className="text-6xl animate-shin-bounce">🎴</div>
        <p className="text-lg text-center text-shin-black/70">
          {lang === 'es' ? 'Gira la ruleta y elige!' : '转动轮盘，做出选择！'}
        </p>
        <div className="bg-shin-cream border-3 border-shin-black rounded-xl p-4 max-w-sm text-center">
          <p className="font-display text-sm mb-2">
            {lang === 'es' ? 'PUNTUACION' : '得分规则'}
          </p>
          <div className="flex justify-center gap-3 text-xs">
            <span className="bg-shin-green text-white px-2 py-1 rounded border-2 border-shin-black">
              {lang === 'es' ? 'Facil: 50pts' : '简单: 50分'}
            </span>
            <span className="bg-shin-orange text-white px-2 py-1 rounded border-2 border-shin-black">
              {lang === 'es' ? 'Media: 100pts' : '中等: 100分'}
            </span>
            <span className="bg-shin-red text-white px-2 py-1 rounded border-2 border-shin-black">
              {lang === 'es' ? 'Alta: 150pts' : '困难: 150分'}
            </span>
          </div>
          <p className="text-xs text-shin-black/50 mt-2">
            {lang === 'es'
              ? 'La otra jugadora vota si completaste bien'
              : '另一个玩家投票决定你是否完成'}
          </p>
        </div>
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

  // ─── Ready phase ───
  if (phase === 'ready') {
    return (
      <div className="flex flex-col items-center gap-5 py-4">
        <Scoreboard players={players} />

        <div className="font-display text-sm text-shin-black/60">
          {lang === 'es'
            ? `Ronda ${data.roundsPlayed + 1}`
            : `第 ${data.roundsPlayed + 1} 轮`}
        </div>

        <SpinnerWheel players={players} targetAngle={0} isSpinning={false} />

        <p className="text-center text-shin-black/60 text-sm">
          {lang === 'es'
            ? 'Presiona GIRAR para ver quien va!'
            : '按"转"看看轮到谁！'}
        </p>

        <Button
          variant="primary"
          size="lg"
          onClick={() => {
            setSpinDone(false)
            sendAction({ type: 'spin-wheel' })
          }}
          className="animate-shin-bounce"
          disabled={sending}
        >
          🎰 {lang === 'es' ? 'GIRAR!' : '转！'}
        </Button>
      </div>
    )
  }

  // ─── Spinning phase ───
  if (phase === 'spinning') {
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        <Scoreboard players={players} />

        <SpinnerWheel
          players={players}
          targetAngle={data.spinAngle}
          isSpinning={true}
          onSpinComplete={() => setSpinDone(true)}
        />

        {!spinDone && (
          <p className="font-display text-xl text-shin-black/60 animate-pulse">
            {lang === 'es' ? 'Girando...' : '旋转中...'}
          </p>
        )}

        {spinDone && chosenPlayer && (
          <div className="flex flex-col items-center gap-4 animate-shin-pop">
            <Onomatopoeia
              text={chosenPlayer.name + '!'}
              color="text-shin-yellow"
              rotation={-5}
              duration={2500}
            />

            <TurnBanner
              playerName={chosenPlayer.name}
              flag={chosenPlayer.lang === 'es' ? '🇻🇪' : '🇨🇳'}
              text={lang === 'es' ? '¡Te toca!' : '轮到你了！'}
              isMe={isChosen}
            />

            <Button
              variant="secondary"
              size="lg"
              onClick={() => sendAction({ type: 'spin-complete' })}
              disabled={sending}
            >
              {lang === 'es' ? 'CONTINUAR' : '继续'}
            </Button>
          </div>
        )}
      </div>
    )
  }

  // ─── Choosing phase ───
  if (phase === 'choosing') {
    const passesLeft = 1 - (data.passesUsed[playerId] || 0)

    return (
      <div className="flex flex-col items-center gap-5 py-4">
        <Scoreboard players={players} />

        <TurnBanner
          playerName={chosenPlayer?.name || ''}
          flag={chosenPlayer?.lang === 'es' ? '🇻🇪' : '🇨🇳'}
          text={
            isChosen
              ? lang === 'es' ? '¡Tu turno! Elige verdad o reto' : '你的回合！选择真心话或大冒险'
              : lang === 'es' ? 'Esperando su eleccion...' : '等待选择...'
          }
          isMe={isChosen}
        />

        {isChosen ? (
          <div className="flex flex-col items-center gap-4">
            <p className="font-display text-2xl text-shin-black text-center">
              {lang === 'es' ? '¿VERDAD O RETO?' : '真心话还是大冒险？'}
            </p>

            <div className="flex gap-4">
              <Button
                variant="secondary"
                size="lg"
                onClick={() =>
                  sendAction({ type: 'choose-truth-dare', payload: { choice: 'truth' } })
                }
                className="min-w-[140px]"
                disabled={sending}
              >
                <span className="text-2xl">🤔</span>
                <span>{lang === 'es' ? 'VERDAD' : '真心话'}</span>
              </Button>

              <Button
                variant="primary"
                size="lg"
                onClick={() =>
                  sendAction({ type: 'choose-truth-dare', payload: { choice: 'dare' } })
                }
                className="min-w-[140px]"
                disabled={sending}
              >
                <span className="text-2xl">🔥</span>
                <span>{lang === 'es' ? 'RETO' : '大冒险'}</span>
              </Button>
            </div>

            {passesLeft > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => sendAction({ type: 'use-pass' })}
                disabled={sending}
              >
                🙅 {lang === 'es'
                  ? `Pasar (${passesLeft} restante)`
                  : `跳过 (剩余 ${passesLeft})`}
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center">
            <span className="text-4xl inline-block animate-shin-wiggle">🤔</span>
            <p className="font-display text-lg text-shin-black/70 animate-pulse mt-2">
              {lang === 'es'
                ? `${chosenPlayer?.name} esta eligiendo...`
                : `${chosenPlayer?.name} 正在选择...`}
            </p>
          </div>
        )}
      </div>
    )
  }

  // ─── Showing card phase ───
  if (phase === 'showing-card' && data.currentCard) {
    const choiceEmoji = data.choice === 'truth' ? '🤔' : '🔥'
    const choiceLabel =
      data.choice === 'truth'
        ? lang === 'es' ? 'VERDAD' : '真心话'
        : lang === 'es' ? 'RETO' : '大冒险'
    const choiceColor =
      data.choice === 'truth' ? 'bg-shin-blue' : 'bg-shin-red'

    const difficultyPoints: Record<string, number> = { easy: 50, medium: 100, hard: 150 }
    const currentPoints = difficultyPoints[data.currentCard.difficulty] || 50
    const isVoter = !isChosen // the OTHER player votes

    return (
      <div className="flex flex-col items-center gap-5 py-4">
        <Scoreboard players={players} />

        {/* Who is performing */}
        <TurnBanner
          playerName={chosenPlayer?.name || ''}
          flag={chosenPlayer?.lang === 'es' ? '🇻🇪' : '🇨🇳'}
          text={
            isChosen
              ? lang === 'es' ? '¡Tu turno! Responde o haz el reto' : '你的回合！回答或完成挑战'
              : lang === 'es' ? `${chosenPlayer?.name} debe responder` : `${chosenPlayer?.name} 必须回答`
          }
          isMe={isChosen}
        />

        {/* Choice badge */}
        <div
          className={`${choiceColor} text-white px-6 py-2 rounded-lg border-3 border-shin-black font-display text-xl flex items-center gap-2 animate-shin-slam`}
        >
          <span>{choiceEmoji}</span>
          <span>{choiceLabel}</span>
          <span className="text-sm ml-2 opacity-80">+{currentPoints}pts</span>
        </div>

        {/* Card */}
        <Card variant="result" className="max-w-md w-full animate-shin-pop">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-shin-black/40">
              {lang === 'es' ? `Para: ${chosenPlayer?.name}` : `给: ${chosenPlayer?.name}`}
            </span>
            <DifficultyBadge difficulty={data.currentCard.difficulty} />
          </div>

          <p className="text-lg font-bold text-shin-black mb-4 leading-relaxed">
            {data.currentCard.es}
          </p>

          <p className="text-lg font-bold text-shin-black/70 leading-relaxed font-chinese">
            {data.currentCard.zh}
          </p>
        </Card>

        {/* Voting section - only the OTHER player votes */}
        {isVoter && !data.voted && (
          <Card variant="game" className="max-w-md w-full border-shin-yellow">
            <p className="font-display text-base text-center mb-3">
              {lang === 'es'
                ? `¿${chosenPlayer?.name} lo hizo bien?`
                : `${chosenPlayer?.name} 完成了吗？`}
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="success"
                size="lg"
                onClick={() => sendAction({ type: 'vote-completed', payload: { completed: true } })}
                disabled={sending}
              >
                ✅ {lang === 'es' ? 'SI! +' + currentPoints + 'pts' : '是的！+' + currentPoints + '分'}
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => sendAction({ type: 'vote-completed', payload: { completed: false } })}
                disabled={sending}
              >
                👎 {lang === 'es' ? 'No lo hizo' : '没完成'}
              </Button>
            </div>
          </Card>
        )}

        {/* Vote result */}
        {data.voted && (
          <div className="text-center animate-shin-pop">
            <p className="font-display text-lg text-shin-green">
              ✅ {lang === 'es' ? 'Votado!' : '已投票！'}
            </p>
          </div>
        )}

        {/* Waiting for vote - shown to the chosen player */}
        {isChosen && !data.voted && (
          <p className="text-sm text-shin-black/50 animate-pulse text-center">
            {lang === 'es'
              ? `${otherPlayer?.name} va a votar si lo hiciste bien...`
              : `${otherPlayer?.name} 将投票决定你是否完成...`}
          </p>
        )}

        {/* Translation chat */}
        <TranslationChat
          lang={lang}
          roomCode={roomCode}
          playerId={playerId}
          playerName={myName}
        />

        {/* Next round - only available after voting */}
        <Button
          variant="secondary"
          size="lg"
          onClick={() => sendAction({ type: 'next-truth-dare-round' })}
          disabled={sending || !data.voted}
        >
          {lang === 'es' ? 'SIGUIENTE RONDA' : '下一轮'}
        </Button>

        {!data.voted && (
          <p className="text-xs text-shin-black/40">
            {lang === 'es'
              ? 'Debes votar antes de continuar'
              : '必须投票后才能继续'}
          </p>
        )}
      </div>
    )
  }

  return null
}
