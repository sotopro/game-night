import { NextResponse } from 'next/server'
import { getRoomState, setRoomState } from '@/lib/redis'
import { pusherServer } from '@/lib/pusher'
import { processAction } from '@/lib/gameLogic'
import type { GameAction, ChatMessage } from '@/lib/types'

export async function POST(req: Request) {
  const { code, playerId, action } = (await req.json()) as {
    code: string
    playerId: string
    action: GameAction
  }

  // Handle chat phrases separately
  if (action.type === 'send-phrase') {
    const state = await getRoomState(code)
    if (!state) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    const sender = state.players.find((p) => p.id === playerId)
    if (!sender) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 })
    }

    const chatMessage: ChatMessage = {
      senderId: playerId,
      senderName: sender.name,
      phraseIndex: action.payload.phraseIndex,
      timestamp: Date.now(),
    }

    await pusherServer.trigger(`presence-room-${code}`, 'game:chat', chatMessage)
    return NextResponse.json({ success: true })
  }

  // Handle translated messages: broadcast-only, no Redis save
  if ((action as any).type === 'translate-msg') {
    await pusherServer.trigger(`presence-room-${code}`, 'game:translate-msg', (action as any).payload)
    return NextResponse.json({ success: true })
  }

  // Handle draw strokes: broadcast-only, no Redis save
  if (action.type === 'draw-stroke') {
    await pusherServer.trigger(`presence-room-${code}`, 'game:draw-stroke', action.payload)
    return NextResponse.json({ success: true })
  }

  // All other game actions
  const state = await getRoomState(code)
  if (!state) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 })
  }

  const newState = processAction(state, playerId, action)

  await setRoomState(code, newState)
  await pusherServer.trigger(`presence-room-${code}`, 'game:state-update', newState)

  return NextResponse.json({ success: true, state: newState })
}
