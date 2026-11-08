import { createClient } from 'redis'
import type { RoomState } from './types'

// Redis of the VPS (REDIS_URL, rediss:// with the company CA via NODE_EXTRA_CA_CERTS).
// The game-night user may only touch keys under "gn:".
const PREFIX = 'gn:'
const ROOM_TTL = 86400 // 24 hours

const makeClient = () => createClient({ url: process.env.REDIS_URL })
type Client = ReturnType<typeof makeClient>
let client: Promise<Client> | null = null

function redis(): Promise<Client> {
  if (!client) {
    const c = makeClient()
    c.on('error', (error) => console.error('redis error', error))
    client = c.connect().catch((error) => {
      client = null
      throw error
    })
  }
  return client
}

export async function getRoomState(code: string): Promise<RoomState | null> {
  const data = await (await redis()).get(`${PREFIX}room:${code}`)
  return data ? (JSON.parse(data) as RoomState) : null
}

export async function setRoomState(code: string, state: RoomState): Promise<void> {
  await (await redis()).set(`${PREFIX}room:${code}`, JSON.stringify(state), { EX: ROOM_TTL })
}

export async function deleteRoom(code: string): Promise<void> {
  await (await redis()).del(`${PREFIX}room:${code}`)
}
