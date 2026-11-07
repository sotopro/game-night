import Pusher from 'pusher'
import PusherClient from 'pusher-js'

// Realtime runs on Sockudo, a Pusher-protocol server on the VPS: the Pusher SDKs stay, only the
// hosts change. The server publishes over the internal network; browsers connect to the public
// host, where the gateway sends /app/* to Sockudo.
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  host: process.env.PUSHER_HOST!,
  port: process.env.PUSHER_PORT ?? '6001',
  useTLS: process.env.PUSHER_USE_TLS === 'true',
})

// Client-side Pusher instance (singleton)
let pusherClientInstance: PusherClient | null = null

export function getPusherClient(playerInfo?: {
  id: string
  name: string
  lang: string
}): PusherClient {
  if (pusherClientInstance) return pusherClientInstance

  const tls = process.env.NEXT_PUBLIC_PUSHER_TLS !== 'false'
  const port = Number(process.env.NEXT_PUBLIC_PUSHER_PORT ?? (tls ? 443 : 6001))
  pusherClientInstance = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: '',
    wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST!,
    wsPort: port,
    wssPort: port,
    forceTLS: tls,
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
    channelAuthorization: {
      endpoint: '/api/pusher-auth',
      transport: 'ajax',
      headers: playerInfo
        ? {
            'x-player-id': playerInfo.id,
            'x-player-name': encodeURIComponent(playerInfo.name),
            'x-player-lang': playerInfo.lang,
          }
        : {},
    },
  })

  return pusherClientInstance
}

export function resetPusherClient() {
  if (pusherClientInstance) {
    pusherClientInstance.disconnect()
    pusherClientInstance = null
  }
}
