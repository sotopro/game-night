'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { useGameStore } from '@/lib/store'
import type { Lang } from '@/lib/types'

export default function LobbyPage() {
  const router = useRouter()
  const { setMyPlayer, setRoom } = useGameStore()

  const [name, setName] = useState('')
  const [lang, setLang] = useState<Lang>('es')
  const [roomCode, setRoomCode] = useState('')
  const [mode, setMode] = useState<'home' | 'create' | 'join'>('home')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async () => {
    if (!name.trim()) return setError('Ingresa tu nombre / 请输入你的名字')
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', playerName: name.trim(), lang }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setMyPlayer(data.playerId, lang)
      setRoom(data.code, data.roomState)

      sessionStorage.setItem('gn_playerId', data.playerId)
      sessionStorage.setItem('gn_playerName', name.trim())
      sessionStorage.setItem('gn_playerLang', lang)

      router.push(`/room/${data.code}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al crear sala')
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async () => {
    if (!name.trim()) return setError('Ingresa tu nombre / 请输入你的名字')
    if (!roomCode.trim()) return setError('Ingresa el codigo / 请输入房间代码')
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join',
          code: roomCode.trim().toUpperCase(),
          playerName: name.trim(),
          lang,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setMyPlayer(data.playerId, lang)
      setRoom(roomCode.trim().toUpperCase(), data.roomState)

      sessionStorage.setItem('gn_playerId', data.playerId)
      sessionStorage.setItem('gn_playerName', name.trim())
      sessionStorage.setItem('gn_playerLang', lang)

      router.push(`/room/${roomCode.trim().toUpperCase()}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al unirse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Floating emojis background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {['🎨', '🧠', '🃏', '🎴', '🎮', '⭐'].map((emoji, i) => (
          <div
            key={i}
            className="absolute text-4xl opacity-20 animate-shin-bounce"
            style={{
              left: `${15 + i * 15}%`,
              top: `${10 + (i % 3) * 30}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + i * 0.5}s`,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Logo */}
      <div className="text-center mb-8 animate-shin-wiggle relative z-10">
        <h1 className="font-display text-6xl md:text-7xl text-shin-red leading-none">
          GAME NIGHT
        </h1>
        <h2 className="font-chinese text-3xl md:text-4xl text-shin-blue font-bold mt-1">
          游戏之夜
        </h2>
        <p className="text-sm text-gray-600 mt-2 font-body">
          Mini juegos bilingues para dos 🎮
        </p>
      </div>

      {/* Main card */}
      <Card variant="result" className="w-full max-w-md relative z-10">
        {mode === 'home' && (
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-sm mb-1">
                Tu nombre / 你的名字
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Daniel / 玉嫦"
                maxLength={20}
              />
            </div>

            <div>
              <label className="block font-bold text-sm mb-1">
                Tu idioma / 你的语言
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setLang('es')}
                  className={`flex-1 p-3 rounded-lg border-3 border-shin-black text-center font-bold transition-all cursor-pointer
                    ${lang === 'es' ? 'bg-shin-blue text-white shadow-[4px_4px_0_#1A1A1A] -translate-y-0.5' : 'bg-white hover:-translate-y-1'}`}
                >
                  🇻🇪 Espanol
                </button>
                <button
                  onClick={() => setLang('zh')}
                  className={`flex-1 p-3 rounded-lg border-3 border-shin-black text-center font-bold transition-all cursor-pointer
                    ${lang === 'zh' ? 'bg-shin-red text-white shadow-[4px_4px_0_#1A1A1A] -translate-y-0.5' : 'bg-white hover:-translate-y-1'}`}
                >
                  🇨🇳 中文
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={() => setMode('create')}
              >
                🎮 {lang === 'es' ? 'Crear Sala' : '创建房间'}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="flex-1"
                onClick={() => setMode('join')}
              >
                🔑 {lang === 'es' ? 'Unirse' : '加入'}
              </Button>
            </div>
          </div>
        )}

        {mode === 'create' && (
          <div className="space-y-4">
            <h3 className="font-display text-2xl text-center uppercase">
              {lang === 'es' ? 'CREAR SALA' : '创建房间'}
            </h3>
            <p className="text-center text-sm text-gray-600">
              {lang === 'es'
                ? 'Se generara un codigo para compartir'
                : '将生成一个分享代码'}
            </p>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleCreate}
              disabled={loading || !name.trim()}
            >
              {loading ? '🐶 ...' : lang === 'es' ? '¡Crear!' : '创建！'}
            </Button>
            <Button variant="ghost" size="sm" className="w-full" onClick={() => setMode('home')}>
              ← {lang === 'es' ? 'Volver' : '返回'}
            </Button>
          </div>
        )}

        {mode === 'join' && (
          <div className="space-y-4">
            <h3 className="font-display text-2xl text-center uppercase">
              {lang === 'es' ? 'UNIRSE A SALA' : '加入房间'}
            </h3>
            <div>
              <label className="block font-bold text-sm mb-1">
                {lang === 'es' ? 'Codigo de sala' : '房间代码'}
              </label>
              <Input
                variant="code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="PANDA"
                maxLength={5}
              />
            </div>
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={handleJoin}
              disabled={loading || !name.trim() || !roomCode.trim()}
            >
              {loading ? '🐶 ...' : lang === 'es' ? '¡Unirse!' : '加入！'}
            </Button>
            <Button variant="ghost" size="sm" className="w-full" onClick={() => setMode('home')}>
              ← {lang === 'es' ? 'Volver' : '返回'}
            </Button>
          </div>
        )}

        {error && (
          <div className="mt-3 p-2 bg-red-50 border-2 border-shin-red rounded-lg text-shin-red text-sm text-center font-bold">
            {error}
          </div>
        )}
      </Card>

      <p className="mt-6 text-xs text-gray-400 relative z-10">
        Game Night 游戏之夜 · v1.0
      </p>
    </main>
  )
}
