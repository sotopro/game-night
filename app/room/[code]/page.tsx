'use client'

import { useEffect, useState, useCallback, use } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/lib/store'
import { usePusher } from '@/hooks/usePusher'
import { getPusherClient, resetPusherClient } from '@/lib/pusher'
import { GameSelector } from '@/components/ui/GameSelector'
import { PlayerBadge } from '@/components/ui/PlayerBadge'
import { Scoreboard } from '@/components/ui/Scoreboard'
import { QuickPhrases } from '@/components/ui/QuickPhrases'
import { Button } from '@/components/ui/Button'
import { Trivia } from '@/components/games/Trivia'
import { Memory } from '@/components/games/Memory'
import { Pictionary } from '@/components/games/Pictionary'
import { TruthDare } from '@/components/games/TruthDare'
import { EmojiCharades } from '@/components/games/EmojiCharades'
import type { Lang } from '@/lib/types'

export default function RoomPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const router = useRouter()
  const store = useGameStore()
  const [showPhrases, setShowPhrases] = useState(false)
  const [ready, setReady] = useState(false)
  const [playerInfo, setPlayerInfo] = useState<{
    id: string
    name: string
    lang: Lang
  } | null>(null)

  // Phase 1: Recover player info from sessionStorage (client-only)
  useEffect(() => {
    const id = store.myPlayerId || sessionStorage.getItem('gn_playerId')
    const name = sessionStorage.getItem('gn_playerName') || ''
    const lang = (store.myLang || sessionStorage.getItem('gn_playerLang') || 'es') as Lang

    if (!id) {
      router.push('/')
      return
    }

    setPlayerInfo({ id, name, lang })

    if (!store.myPlayerId) {
      store.setMyPlayer(id, lang)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Phase 2: Once we have player info, init Pusher and fetch room state
  useEffect(() => {
    if (!playerInfo) return

    resetPusherClient()
    getPusherClient({
      id: playerInfo.id,
      name: playerInfo.name,
      lang: playerInfo.lang,
    })

    const fetchState = async () => {
      try {
        const res = await fetch('/api/room', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'get', code }),
        })
        if (res.ok) {
          const data = await res.json()
          store.setRoom(code, data.roomState)
        }
      } catch {
        // ignore
      }
      setReady(true)
    }

    fetchState()
  }, [playerInfo, code]) // eslint-disable-line react-hooks/exhaustive-deps

  // Phase 3: Connect to Pusher channel only after ready
  usePusher(ready ? code : null)

  const sendAction = useCallback(
    async (action: unknown) => {
      if (!playerInfo) return
      await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, playerId: playerInfo.id, action }),
      })
    },
    [code, playerInfo]
  )

  const handleSelectGame = useCallback(
    (game: string) => {
      sendAction({ type: 'select-game', payload: { game } })
    },
    [sendAction]
  )

  // Loading state
  if (!playerInfo || !ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-shin-cream">
        <div className="text-center">
          <div className="text-4xl animate-shin-spin inline-block">🐶</div>
          <p className="mt-2 font-bold">Cargando... / 加载中...</p>
        </div>
      </div>
    )
  }

  const isWaiting = store.players.length < 2

  return (
    <div className="h-screen flex flex-col bg-shin-cream overflow-hidden">
      {/* Header */}
      <header className="bg-shin-red px-4 py-2 flex items-center justify-between border-b-4 border-shin-black">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-white text-lg">GAME NIGHT</h1>
          <span className="bg-shin-yellow text-shin-black font-display text-sm px-2 py-0.5 rounded border-2 border-shin-black">
            {code}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {store.players.map((player) => (
            <PlayerBadge
              key={player.id}
              player={player}
              size="sm"
              isActive={store.gameState?.activePlayer === player.id}
            />
          ))}

          {/* Connection status */}
          <span
            className={`w-3 h-3 rounded-full border border-shin-black ${
              store.connectionStatus === 'connected'
                ? 'bg-shin-green'
                : store.connectionStatus === 'connecting'
                  ? 'bg-shin-orange animate-pulse'
                  : 'bg-shin-red'
            }`}
          />
        </div>
      </header>

      {/* Waiting for player 2 */}
      {isWaiting ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-4">
            <div className="text-6xl animate-shin-bounce">🎮</div>
            <h2 className="font-display text-3xl uppercase">
              {playerInfo.lang === 'es' ? 'ESPERANDO JUGADORA...' : '等待玩家...'}
            </h2>
            <p className="text-lg">
              {playerInfo.lang === 'es' ? 'Comparte este codigo:' : '分享此代码:'}
            </p>
            <div className="font-display text-5xl text-shin-red bg-white border-4 border-shin-black rounded-xl px-6 py-3 shadow-[6px_6px_0_#1A1A1A] inline-block select-all">
              {code}
            </div>
            <p className="text-sm text-gray-500">
              {playerInfo.lang === 'es'
                ? 'Tu amiga debe ingresar este codigo para unirse'
                : '你的朋友需要输入此代码加入'}
            </p>
          </div>
        </div>
      ) : (
        /* Main game area */
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* Left sidebar - Game selector (hidden on mobile) */}
          <aside className="hidden lg:block w-48 p-3 border-r-4 border-shin-black bg-white">
            <GameSelector
              currentGame={store.currentGame}
              onSelect={handleSelectGame}
              lang={playerInfo.lang}
            />
          </aside>

          {/* Center - Active game */}
          <main className="flex-1 p-4 overflow-y-auto min-h-0">
            {!store.currentGame && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-6xl">🎮</div>
                  <h2 className="font-display text-2xl uppercase">
                    {playerInfo.lang === 'es' ? 'ELIGE UN JUEGO' : '选择游戏'}
                  </h2>

                  {/* Mobile game selector */}
                  <div className="lg:hidden">
                    <GameSelector
                      currentGame={store.currentGame}
                      onSelect={handleSelectGame}
                      lang={playerInfo.lang}
                    />
                  </div>
                </div>
              </div>
            )}

            {store.currentGame === 'trivia' && (
              <Trivia lang={playerInfo.lang} roomCode={code} playerId={playerInfo.id} />
            )}
            {store.currentGame === 'memory' && (
              <Memory lang={playerInfo.lang} roomCode={code} playerId={playerInfo.id} />
            )}
            {store.currentGame === 'pictionary' && (
              <Pictionary lang={playerInfo.lang} roomCode={code} playerId={playerInfo.id} />
            )}
            {store.currentGame === 'truth-dare' && (
              <TruthDare lang={playerInfo.lang} roomCode={code} playerId={playerInfo.id} />
            )}
            {store.currentGame === 'emoji-charades' && (
              <EmojiCharades lang={playerInfo.lang} roomCode={code} playerId={playerInfo.id} />
            )}
          </main>

          {/* Right sidebar - Quick phrases (hidden on mobile, drawer on mobile) */}
          <aside className="hidden lg:flex lg:flex-col w-64 p-3 border-l-4 border-shin-black bg-white overflow-hidden">
            <QuickPhrases lang={playerInfo.lang} roomCode={code} playerId={playerInfo.id} />
          </aside>

          {/* Mobile floating chat button */}
          <button
            onClick={() => setShowPhrases(!showPhrases)}
            className="lg:hidden fixed bottom-20 right-4 z-40 w-14 h-14 bg-shin-yellow border-3 border-shin-black rounded-full shadow-[4px_4px_0_#1A1A1A] flex items-center justify-center text-2xl cursor-pointer hover:-translate-y-1 transition-transform active:translate-y-0"
          >
            💬
          </button>

          {/* Mobile phrases drawer */}
          {showPhrases && (
            <div className="lg:hidden fixed inset-0 z-50">
              <div className="absolute inset-0 bg-shin-black/70" onClick={() => setShowPhrases(false)} />
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t-4 border-shin-black rounded-t-2xl p-4 max-h-[70vh] flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-display text-lg">
                    {playerInfo.lang === 'es' ? '💬 FRASES' : '💬 短语'}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowPhrases(false)}>
                    ✕
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <QuickPhrases lang={playerInfo.lang} roomCode={code} playerId={playerInfo.id} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer - Scoreboard */}
      {store.players.length === 2 && store.currentGame && (
        <footer className="px-4 py-2 border-t-4 border-shin-black bg-white">
          <Scoreboard players={store.players} activePlayerId={store.gameState?.activePlayer} />
        </footer>
      )}

      {/* Mobile game selector bar */}
      {store.players.length === 2 && (
        <div className="lg:hidden flex gap-1 p-2 bg-white border-t-2 border-shin-black">
          {[
            { type: 'trivia' as const, emoji: '🧠' },
            { type: 'memory' as const, emoji: '🃏' },
            { type: 'pictionary' as const, emoji: '🎨' },
            { type: 'truth-dare' as const, emoji: '🎴' },
            { type: 'emoji-charades' as const, emoji: '🎭' },
          ].map((game) => (
            <button
              key={game.type}
              onClick={() => handleSelectGame(game.type)}
              className={`flex-1 py-2 text-xl rounded-lg border-2 border-shin-black transition-all cursor-pointer
                ${store.currentGame === game.type ? 'bg-shin-red text-white -translate-y-0.5 shadow-[2px_2px_0_#1A1A1A]' : 'bg-white hover:bg-shin-cream'}`}
            >
              {game.emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
