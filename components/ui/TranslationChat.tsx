'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from './Button'
import { Input } from './Input'
import type { Lang } from '@/lib/types'

interface ChatMsg {
  id: number
  sender: string
  senderLang: Lang
  original: string
  translated: string
  timestamp: number
}

interface TranslationChatProps {
  lang: Lang
  roomCode: string
  playerId: string
  playerName: string
}

export function TranslationChat({ lang, roomCode, playerId, playerName }: TranslationChatProps) {
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [translating, setTranslating] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const eventSourceRef = useRef<boolean>(false)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  // Listen for incoming translated messages via Pusher
  useEffect(() => {
    if (eventSourceRef.current) return
    eventSourceRef.current = true

    const { getPusherClient } = require('@/lib/pusher')
    const client = getPusherClient()
    const channel = client.channel(`presence-room-${roomCode}`)
    if (!channel) return

    const handler = (data: ChatMsg) => {
      setMessages((prev) => [...prev.slice(-30), data])
    }
    channel.bind('game:translate-msg', handler)

    return () => {
      channel.unbind('game:translate-msg', handler)
      eventSourceRef.current = false
    }
  }, [roomCode])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || translating) return

    setTranslating(true)
    setInput('')

    try {
      const targetLang = lang === 'es' ? 'zh' : 'es'

      // Translate
      const translateRes = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, from: lang, to: targetLang }),
      })
      const { translated } = await translateRes.json()

      const msg: ChatMsg = {
        id: Date.now(),
        sender: playerName,
        senderLang: lang,
        original: text,
        translated,
        timestamp: Date.now(),
      }

      // Broadcast via Pusher
      await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: roomCode,
          playerId,
          action: { type: 'translate-msg', payload: msg },
        }),
      })
    } catch {
      // ignore
    } finally {
      setTranslating(false)
    }
  }, [input, lang, roomCode, playerId, playerName, translating])

  return (
    <div className="w-full max-w-md mx-auto border-3 border-shin-black rounded-xl bg-white overflow-hidden">
      {/* Header */}
      <div className="bg-shin-blue text-white px-3 py-2 font-display text-sm flex items-center gap-2">
        <span>💬</span>
        <span>{lang === 'es' ? 'CHAT TRADUCIDO' : '翻译聊天'}</span>
        <span className="ml-auto text-xs opacity-70">ES ↔ 中文</span>
      </div>

      {/* Messages */}
      <div className="h-48 overflow-y-auto p-3 space-y-2 bg-shin-cream/50">
        {messages.length === 0 && (
          <p className="text-center text-sm text-shin-black/40 py-6">
            {lang === 'es'
              ? 'Escribe un mensaje, se traduce automaticamente!'
              : '写一条消息，自动翻译！'}
          </p>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender === playerName
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[10px] font-bold text-shin-black/50 mb-0.5">
                {msg.sender} {msg.senderLang === 'es' ? '🇻🇪' : '🇨🇳'}
              </span>
              <div
                className={`rounded-lg px-3 py-2 max-w-[85%] border-2 ${
                  isMe
                    ? 'bg-shin-blue text-white border-shin-blue'
                    : 'bg-white text-shin-black border-shin-black'
                }`}
              >
                <p className="text-sm font-bold">{msg.original}</p>
                <p className={`text-xs mt-1 ${isMe ? 'text-white/70' : 'text-shin-black/50'}`}>
                  {msg.translated}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 p-2 border-t-2 border-shin-black/20">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={lang === 'es' ? 'Escribe en espanol...' : '用中文写...'}
          className="text-sm py-2"
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage()
          }}
        />
        <Button
          variant="primary"
          size="sm"
          onClick={sendMessage}
          disabled={!input.trim() || translating}
        >
          {translating ? '...' : '→'}
        </Button>
      </div>
    </div>
  )
}
