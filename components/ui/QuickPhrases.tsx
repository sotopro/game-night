'use client'

import { useEffect, useRef } from 'react'
import { quickPhrases } from '@/lib/gameData'
import { useGameStore } from '@/lib/store'
import type { Lang } from '@/lib/types'

interface QuickPhrasesProps {
  lang: Lang
  roomCode: string
  playerId: string
}

export function QuickPhrases({ lang, roomCode, playerId }: QuickPhrasesProps) {
  const { chatMessages } = useGameStore()
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages.length])

  const sendPhrase = async (phraseIndex: number) => {
    await fetch('/api/game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: roomCode,
        playerId,
        action: { type: 'send-phrase', payload: { phraseIndex } },
      }),
    })
  }

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      <h3 className="font-display text-base uppercase text-center mb-2 shrink-0">
        {lang === 'es' ? '💬 FRASES' : '💬 短语'}
      </h3>

      {/* Chat feed */}
      <div className="shrink-0 overflow-y-auto mb-2 space-y-1 max-h-32">
        {chatMessages.map((msg, i) => {
          const phrase = quickPhrases[msg.phraseIndex]
          if (!phrase) return null
          const isMe = msg.senderId === playerId
          return (
            <div
              key={i}
              className={`text-xs p-1.5 rounded border-2 border-shin-black ${
                isMe ? 'bg-shin-cream' : 'bg-white'
              }`}
            >
              <span className="font-bold">{msg.senderName}:</span>{' '}
              <span>{phrase.emoji} {lang === 'es' ? phrase.es : phrase.zh}</span>
            </div>
          )
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Phrase buttons */}
      <div className="overflow-y-auto space-y-1 flex-1 min-h-0 pr-1">
        {quickPhrases.map((phrase, i) => (
          <button
            key={i}
            onClick={() => sendPhrase(i)}
            className="w-full text-left px-2 py-1.5 text-sm bg-shin-cream border-2 border-shin-black rounded
              hover:-translate-y-0.5 hover:shadow-[2px_2px_0_#1A1A1A] transition-all cursor-pointer
              active:translate-y-0 active:shadow-none"
          >
            <span className="mr-1">{phrase.emoji}</span>
            <span className="font-medium">{lang === 'es' ? phrase.es : phrase.zh}</span>
            {lang === 'es' && (
              <span className="block text-xs text-gray-500 font-mono ml-5">{phrase.pinyin}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
