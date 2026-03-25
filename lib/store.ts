'use client'

import { create } from 'zustand'
import type { Lang, GameType, GameState, Player, RoomState, ChatMessage } from './types'

interface GameStore {
  // Server-synced state
  roomCode: string | null
  players: Player[]
  currentGame: GameType | null
  gameState: GameState | null
  selectedDeck: string | undefined

  // Client-only state
  myPlayerId: string | null
  myLang: Lang | null
  connectionStatus: 'connecting' | 'connected' | 'disconnected'
  chatMessages: ChatMessage[]

  // Computed
  isMyTurn: () => boolean
  myPlayer: () => Player | null
  opponentPlayer: () => Player | null

  // Actions
  setMyPlayer: (id: string, lang: Lang) => void
  setRoom: (code: string, state: RoomState) => void
  updateFromServer: (state: RoomState) => void
  addChatMessage: (msg: ChatMessage) => void
  setConnectionStatus: (status: 'connecting' | 'connected' | 'disconnected') => void
  reset: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  roomCode: null,
  players: [],
  currentGame: null,
  gameState: null,
  selectedDeck: undefined,
  myPlayerId: null,
  myLang: null,
  connectionStatus: 'disconnected',
  chatMessages: [],

  isMyTurn: () => {
    const { gameState, myPlayerId } = get()
    if (!gameState || !myPlayerId) return false
    return gameState.activePlayer === myPlayerId
  },

  myPlayer: () => {
    const { players, myPlayerId } = get()
    return players.find((p) => p.id === myPlayerId) ?? null
  },

  opponentPlayer: () => {
    const { players, myPlayerId } = get()
    return players.find((p) => p.id !== myPlayerId) ?? null
  },

  setMyPlayer: (id, lang) => set({ myPlayerId: id, myLang: lang }),

  setRoom: (code, state) =>
    set({
      roomCode: code,
      players: state.players,
      currentGame: state.currentGame,
      gameState: state.gameState,
      selectedDeck: state.selectedDeck,
    }),

  updateFromServer: (state) =>
    set({
      players: state.players,
      currentGame: state.currentGame,
      gameState: state.gameState,
      selectedDeck: state.selectedDeck,
    }),

  addChatMessage: (msg) =>
    set((s) => ({ chatMessages: [...s.chatMessages.slice(-50), msg] })),

  setConnectionStatus: (status) => set({ connectionStatus: status }),

  reset: () =>
    set({
      roomCode: null,
      players: [],
      currentGame: null,
      gameState: null,
      myPlayerId: null,
      myLang: null,
      connectionStatus: 'disconnected',
      chatMessages: [],
    }),
}))
