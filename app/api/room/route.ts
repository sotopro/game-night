import { NextResponse } from 'next/server'
import { getRoomState, setRoomState } from '@/lib/redis'
import { pusherServer } from '@/lib/pusher'
import type { RoomState, Player, Lang } from '@/lib/types'

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  let code = ''
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export async function POST(req: Request) {
  const body = await req.json()
  const { action } = body

  if (action === 'create') {
    const { playerName, lang } = body as { playerName: string; lang: Lang }

    // Generate unique room code
    let code = generateRoomCode()
    let existing = await getRoomState(code)
    let attempts = 0
    while (existing && attempts < 10) {
      code = generateRoomCode()
      existing = await getRoomState(code)
      attempts++
    }

    const player: Player = {
      id: crypto.randomUUID(),
      name: playerName,
      lang,
      score: 0,
    }

    const roomState: RoomState = {
      code,
      players: [player],
      currentGame: null,
      gameState: null,
      createdAt: Date.now(),
    }

    await setRoomState(code, roomState)

    return NextResponse.json({
      code,
      playerId: player.id,
      roomState,
    })
  }

  if (action === 'join') {
    const { code, playerName, lang } = body as {
      code: string
      playerName: string
      lang: Lang
    }

    const roomState = await getRoomState(code.toUpperCase())
    if (!roomState) {
      return NextResponse.json({ error: 'Sala no encontrada / 房间未找到' }, { status: 404 })
    }

    if (roomState.players.length >= 2) {
      return NextResponse.json({ error: 'Sala llena / 房间已满' }, { status: 400 })
    }

    const player: Player = {
      id: crypto.randomUUID(),
      name: playerName,
      lang,
      score: 0,
    }

    const updatedState: RoomState = {
      ...roomState,
      players: [...roomState.players, player],
    }

    await setRoomState(code.toUpperCase(), updatedState)

    await pusherServer.trigger(
      `presence-room-${code.toUpperCase()}`,
      'game:player-joined',
      updatedState
    )

    return NextResponse.json({
      playerId: player.id,
      roomState: updatedState,
    })
  }

  if (action === 'get') {
    const { code } = body as { code: string }
    const roomState = await getRoomState(code.toUpperCase())
    if (!roomState) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }
    return NextResponse.json({ roomState })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
