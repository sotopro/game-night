import { NextResponse } from 'next/server'
import { pusherServer } from '@/lib/pusher'

export async function POST(req: Request) {
  const body = await req.text()
  const params = new URLSearchParams(body)

  const socketId = params.get('socket_id')
  const channel = params.get('channel_name')

  if (!socketId || !channel) {
    return NextResponse.json({ error: 'Missing socket_id or channel_name' }, { status: 400 })
  }

  // For presence channels, we need user data
  // The player info is sent via custom headers
  const playerId = req.headers.get('x-player-id') || 'anonymous'
  const playerName = decodeURIComponent(req.headers.get('x-player-name') || 'Player')
  const playerLang = req.headers.get('x-player-lang') || 'es'

  const authResponse = pusherServer.authorizeChannel(socketId, channel, {
    user_id: playerId,
    user_info: { name: playerName, lang: playerLang },
  })

  return NextResponse.json(authResponse)
}
