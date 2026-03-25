import { Redis } from '@upstash/redis'
import type { RoomState } from './types'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const ROOM_TTL = 86400 // 24 hours

export async function getRoomState(code: string): Promise<RoomState | null> {
  const data = await redis.get<RoomState>(`room:${code}`)
  return data
}

export async function setRoomState(code: string, state: RoomState): Promise<void> {
  await redis.set(`room:${code}`, state, { ex: ROOM_TTL })
}

export async function deleteRoom(code: string): Promise<void> {
  await redis.del(`room:${code}`)
}
