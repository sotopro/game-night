export type Lang = 'es' | 'zh'
export type GameType = 'pictionary' | 'trivia' | 'memory' | 'truth-dare' | 'emoji-charades'
export type GamePhase = 'waiting' | 'playing' | 'reveal' | 'results'

export interface Player {
  id: string
  name: string
  lang: Lang
  score: number
}

export interface RoomState {
  code: string
  players: Player[]
  currentGame: GameType | null
  gameState: GameState | null
  selectedDeck?: string
  createdAt: number
}

export interface GameState {
  phase: GamePhase
  activePlayer: string
  round: number
  data: TriviaData | MemoryData | PictionaryData | TruthDareData | EmojiCharadesData
}

// ─── Trivia ───
export interface TriviaData {
  type: 'trivia'
  questions: TriviaQuestionSelected[]
  currentQuestionIndex: number
  answers: Record<string, { answer: number; timeRemaining: number } | null>
  questionStartedAt: number
  phase: 'question' | 'reveal' | 'finished'
}

export interface TriviaQuestionSelected {
  id: number
  category: string
  question: { es: string; zh: string }
  options: { es: string; zh: string }[]
  correctIndex: number
  explanation: { es: string; zh: string }
  timerSeconds: number
}

// ─── Memory ───
export interface MemoryData {
  type: 'memory'
  deckName: string
  cards: MemoryCard[]
  flippedIndices: number[]
  matchedPairIds: number[]
  pairsFound: Record<string, number>
  activePlayer: string
  phase: 'playing' | 'finished'
}

export interface MemoryCard {
  id: number
  pairId: number
  lang: 'es' | 'zh'
  text: string
  pinyin: string
  isMatched: boolean
}

// ─── Pictionary ───
export interface PictionaryData {
  type: 'pictionary'
  word: { es: string; zh: string; pinyin: string; category: string }
  drawer: string
  guesser: string
  guesses: string[]
  timeRemaining: number
  roundStartedAt: number
  roundsPlayed: number
  maxRounds: number
  wordsUsedIndices: number[]
  phase: 'drawing' | 'guessed' | 'timeout' | 'finished'
}

// ─── Truth or Dare ───
export interface TruthDareData {
  type: 'truth-dare'
  chosenPlayer: string | null
  choice: 'truth' | 'dare' | null
  currentCard: { es: string; zh: string; difficulty: string } | null
  usedCardIds: number[]
  passesUsed: Record<string, number>
  roundsPlayed: number
  spinAngle: number
  voted: boolean
  phase: 'ready' | 'spinning' | 'choosing' | 'showing-card'
}

// ─── Emoji Charades ───
export interface EmojiCharadesData {
  type: 'emoji-charades'
  prompter: string
  guesser: string
  currentPrompt: { es: string; zh: string; category: string } | null
  emojis: string[]
  guesses: string[]
  roundsPlayed: number
  maxRounds: number
  wordsUsedIndices: number[]
  roundStartedAt: number
  phase: 'prompting' | 'guessed' | 'timeout' | 'finished'
}

// ─── Actions ───
export type GameAction =
  | { type: 'select-game'; payload: { game: GameType } }
  | { type: 'start-game'; payload: { deckName?: string } }
  | { type: 'select-deck'; payload: { deckName: string } }
  | { type: 'submit-answer'; payload: { answer: number; timeRemaining: number } }
  | { type: 'next-question' }
  | { type: 'force-reveal' }
  | { type: 'flip-card'; payload: { cardIndex: number } }
  | { type: 'reset-flipped' }
  | { type: 'start-round' }
  | { type: 'submit-guess'; payload: { guess: string } }
  | { type: 'pictionary-timeout' }
  | { type: 'spin-wheel' }
  | { type: 'choose-truth-dare'; payload: { choice: 'truth' | 'dare' } }
  | { type: 'spin-complete' }
  | { type: 'use-pass' }
  | { type: 'vote-completed'; payload: { completed: boolean } }
  | { type: 'next-truth-dare-round' }
  | { type: 'send-emoji'; payload: { emoji: string } }
  | { type: 'clear-emojis' }
  | { type: 'emoji-guess'; payload: { guess: string } }
  | { type: 'emoji-timeout' }
  | { type: 'next-emoji-round' }
  | { type: 'draw-stroke'; payload: { points: { x: number; y: number }[]; color: string; width: number } }
  | { type: 'send-phrase'; payload: { phraseIndex: number } }

export interface ChatMessage {
  senderId: string
  senderName: string
  phraseIndex: number
  timestamp: number
}
