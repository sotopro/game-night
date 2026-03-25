'use client'

import { useEffect, useRef } from 'react'
import type { Channel, PresenceChannel } from 'pusher-js'
import { getPusherClient } from '@/lib/pusher'
import { useGameStore } from '@/lib/store'
import type { RoomState, ChatMessage } from '@/lib/types'

export function usePusher(roomCode: string | null) {
  const channelRef = useRef<Channel | null>(null)
  const { updateFromServer, addChatMessage, setConnectionStatus } = useGameStore()

  useEffect(() => {
    if (!roomCode) return

    const client = getPusherClient()
    const channelName = `presence-room-${roomCode}`

    client.connection.bind('connected', () => setConnectionStatus('connected'))
    client.connection.bind('connecting', () => setConnectionStatus('connecting'))
    client.connection.bind('disconnected', () => setConnectionStatus('disconnected'))

    if (client.connection.state === 'connected') {
      setConnectionStatus('connected')
    }

    const channel = client.subscribe(channelName) as PresenceChannel
    channelRef.current = channel

    channel.bind('game:state-update', (data: RoomState) => {
      updateFromServer(data)
    })

    channel.bind('game:player-joined', (data: RoomState) => {
      updateFromServer(data)
    })

    channel.bind('game:chat', (data: ChatMessage) => {
      addChatMessage(data)
    })

    return () => {
      channel.unbind_all()
      client.unsubscribe(channelName)
      channelRef.current = null
    }
  }, [roomCode, updateFromServer, addChatMessage, setConnectionStatus])

  return channelRef
}
