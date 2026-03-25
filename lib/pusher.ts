import Pusher from 'pusher'
import PusherClient from 'pusher-js'

// Server-side Pusher instance (used in API routes)
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
})

// Client-side Pusher instance (singleton)
let pusherClientInstance: PusherClient | null = null

export function getPusherClient(playerInfo?: {
  id: string
  name: string
  lang: string
}): PusherClient {
  if (pusherClientInstance) return pusherClientInstance

  pusherClientInstance = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
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
