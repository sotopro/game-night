import type {
  RoomState,
  GameState,
  GameAction,
  GameType,
  TriviaData,
  MemoryData,
  PictionaryData,
  TruthDareData,
  EmojiCharadesData,
} from './types'
import {
  getRandomTriviaQuestions,
  getShuffledMemoryDeck,
  getRandomPictionaryWord,
  getRandomTruthDareCard,
  getRandomEmojiPrompt,
  memoryDeckNames,
} from './gameData'

export function processAction(
  state: RoomState,
  playerId: string,
  action: GameAction
): RoomState {
  switch (action.type) {
    case 'select-game':
      return selectGame(state, action.payload.game)
    case 'select-deck':
      return { ...state, selectedDeck: action.payload.deckName }
    case 'start-game':
      return startGame(state, playerId, action.payload?.deckName)
    case 'submit-answer':
      return submitAnswer(state, playerId, action.payload.answer, action.payload.timeRemaining)
    case 'next-question':
      return nextQuestion(state)
    case 'force-reveal':
      return forceReveal(state)
    case 'flip-card':
      return flipCard(state, playerId, action.payload.cardIndex)
    case 'reset-flipped':
      return resetFlipped(state)
    case 'start-round':
      return startPictionaryRound(state)
    case 'submit-guess':
      return submitGuess(state, playerId, action.payload.guess)
    case 'pictionary-timeout':
      return pictionaryTimeout(state)
    case 'spin-wheel':
      return spinWheel(state)
    case 'spin-complete':
      return spinComplete(state)
    case 'choose-truth-dare':
      return chooseTruthDare(state, action.payload.choice)
    case 'use-pass':
      return usePass(state, playerId)
    case 'vote-completed':
      return voteCompleted(state, playerId, action.payload.completed)
    case 'next-truth-dare-round':
      return nextTruthDareRound(state)
    case 'send-emoji':
      return sendEmoji(state, playerId, action.payload.emoji)
    case 'clear-emojis':
      return clearEmojis(state, playerId)
    case 'emoji-guess':
      return emojiGuess(state, playerId, action.payload.guess)
    case 'emoji-timeout':
      return emojiTimeout(state)
    case 'next-emoji-round':
      return nextEmojiRound(state)
    default:
      return state
  }
}

// ─── Select Game ───
function selectGame(state: RoomState, game: GameType): RoomState {
  return {
    ...state,
    currentGame: game,
    gameState: null,
  }
}

// ─── Start Game ───
function startGame(state: RoomState, playerId: string, deckName?: string): RoomState {
  if (!state.currentGame || state.players.length < 2) return state

  const p1 = state.players[0]
  const p2 = state.players[1]

  let gameState: GameState

  switch (state.currentGame) {
    case 'trivia': {
      const questions = getRandomTriviaQuestions(10)
      const data: TriviaData = {
        type: 'trivia',
        questions,
        currentQuestionIndex: 0,
        answers: {},
        questionStartedAt: Date.now(),
        phase: 'question',
      }
      gameState = { phase: 'playing', activePlayer: p1.id, round: 1, data }
      break
    }

    case 'memory': {
      const deck = deckName || memoryDeckNames[Math.floor(Math.random() * memoryDeckNames.length)]
      const cards = getShuffledMemoryDeck(deck)
      const data: MemoryData = {
        type: 'memory',
        deckName: deck,
        cards,
        flippedIndices: [],
        matchedPairIds: [],
        pairsFound: { [p1.id]: 0, [p2.id]: 0 },
        activePlayer: p1.id,
        phase: 'playing',
      }
      gameState = { phase: 'playing', activePlayer: p1.id, round: 1, data }
      break
    }

    case 'pictionary': {
      const { word, index } = getRandomPictionaryWord()
      const data: PictionaryData = {
        type: 'pictionary',
        word: { es: word.es, zh: word.zh, pinyin: word.pinyin, category: word.category },
        drawer: p1.id,
        guesser: p2.id,
        guesses: [],
        timeRemaining: 60,
        roundStartedAt: Date.now(),
        roundsPlayed: 0,
        maxRounds: 6,
        wordsUsedIndices: [index],
        phase: 'drawing',
      }
      gameState = { phase: 'playing', activePlayer: p1.id, round: 1, data }
      break
    }

    case 'truth-dare': {
      const data: TruthDareData = {
        type: 'truth-dare',
        chosenPlayer: null,
        choice: null,
        currentCard: null,
        usedCardIds: [],
        passesUsed: { [p1.id]: 0, [p2.id]: 0 },
        roundsPlayed: 0,
        spinAngle: 0,
        voted: false,
        phase: 'ready',
      }
      gameState = { phase: 'playing', activePlayer: p1.id, round: 1, data }
      break
    }

    case 'emoji-charades': {
      const { prompt, index } = getRandomEmojiPrompt()
      const data: EmojiCharadesData = {
        type: 'emoji-charades',
        prompter: p1.id,
        guesser: p2.id,
        currentPrompt: { es: prompt.es, zh: prompt.zh, category: prompt.category },
        emojis: [],
        guesses: [],
        roundsPlayed: 0,
        maxRounds: 8,
        wordsUsedIndices: [index],
        roundStartedAt: Date.now(),
        phase: 'prompting',
      }
      gameState = { phase: 'playing', activePlayer: p1.id, round: 1, data }
      break
    }

    default:
      return state
  }

  // Reset scores
  const players = state.players.map((p) => ({ ...p, score: 0 }))
  return { ...state, players, gameState }
}

// ─── Trivia: Submit Answer ───
function submitAnswer(
  state: RoomState,
  playerId: string,
  answer: number,
  timeRemaining: number
): RoomState {
  if (!state.gameState) return state
  const data = state.gameState.data as TriviaData
  if (data.type !== 'trivia' || data.phase !== 'question') return state
  if (data.answers[playerId]) return state // already answered

  const newAnswers = { ...data.answers, [playerId]: { answer, timeRemaining } }
  const allAnswered = state.players.every((p) => newAnswers[p.id])

  const question = data.questions[data.currentQuestionIndex]
  let players = state.players

  if (allAnswered) {
    // Score both players
    players = state.players.map((p) => {
      const a = newAnswers[p.id]
      if (a && a.answer === question.correctIndex) {
        return { ...p, score: p.score + 100 + Math.floor(a.timeRemaining * 10) }
      }
      return p
    })
  }

  const newData: TriviaData = {
    ...data,
    answers: newAnswers,
    phase: allAnswered ? 'reveal' : 'question',
  }

  return {
    ...state,
    players,
    gameState: { ...state.gameState, data: newData },
  }
}

// ─── Trivia: Force Reveal (race condition fix) ───
function forceReveal(state: RoomState): RoomState {
  if (!state.gameState) return state
  const data = state.gameState.data as TriviaData
  if (data.type !== 'trivia' || data.phase !== 'question') return state

  const allAnswered = state.players.every((p) => data.answers[p.id])
  if (!allAnswered) return state

  const question = data.questions[data.currentQuestionIndex]
  const players = state.players.map((p) => {
    const a = data.answers[p.id]
    if (a && a.answer === question.correctIndex) {
      return { ...p, score: p.score + 100 + Math.floor(a.timeRemaining * 10) }
    }
    return p
  })

  return {
    ...state,
    players,
    gameState: {
      ...state.gameState,
      data: { ...data, phase: 'reveal' },
    },
  }
}

// ─── Trivia: Next Question ───
function nextQuestion(state: RoomState): RoomState {
  if (!state.gameState) return state
  const data = state.gameState.data as TriviaData
  if (data.type !== 'trivia') return state

  const nextIndex = data.currentQuestionIndex + 1
  if (nextIndex >= data.questions.length) {
    return {
      ...state,
      gameState: {
        ...state.gameState,
        phase: 'results',
        data: { ...data, phase: 'finished' },
      },
    }
  }

  const newData: TriviaData = {
    ...data,
    currentQuestionIndex: nextIndex,
    answers: {},
    questionStartedAt: Date.now(),
    phase: 'question',
  }

  return {
    ...state,
    gameState: {
      ...state.gameState,
      round: nextIndex + 1,
      data: newData,
    },
  }
}

// ─── Memory: Flip Card ───
function flipCard(state: RoomState, playerId: string, cardIndex: number): RoomState {
  if (!state.gameState) return state
  const data = state.gameState.data as MemoryData
  if (data.type !== 'memory' || data.phase !== 'playing') return state
  if (data.activePlayer !== playerId) return state
  if (data.flippedIndices.length >= 2) return state
  if (data.flippedIndices.includes(cardIndex)) return state
  if (data.cards[cardIndex].isMatched) return state

  const newFlipped = [...data.flippedIndices, cardIndex]

  if (newFlipped.length === 2) {
    const card1 = data.cards[newFlipped[0]]
    const card2 = data.cards[newFlipped[1]]
    const isMatch = card1.pairId === card2.pairId && card1.lang !== card2.lang

    if (isMatch) {
      const newCards = data.cards.map((c) =>
        c.pairId === card1.pairId ? { ...c, isMatched: true } : c
      )
      const newPairsFound = {
        ...data.pairsFound,
        [playerId]: (data.pairsFound[playerId] || 0) + 1,
      }
      const allMatched = newCards.every((c) => c.isMatched)

      const players = state.players.map((p) =>
        p.id === playerId ? { ...p, score: p.score + 10 } : p
      )

      return {
        ...state,
        players,
        gameState: {
          ...state.gameState,
          data: {
            ...data,
            cards: newCards,
            flippedIndices: newFlipped,
            matchedPairIds: [...data.matchedPairIds, card1.pairId],
            pairsFound: newPairsFound,
            phase: allMatched ? 'finished' : 'playing',
          },
        },
      }
    }
  }

  return {
    ...state,
    gameState: {
      ...state.gameState,
      data: { ...data, flippedIndices: newFlipped },
    },
  }
}

// ─── Memory: Reset Flipped (after mismatch) ───
function resetFlipped(state: RoomState): RoomState {
  if (!state.gameState) return state
  const data = state.gameState.data as MemoryData
  if (data.type !== 'memory') return state

  const otherPlayer = state.players.find((p) => p.id !== data.activePlayer)
  if (!otherPlayer) return state

  return {
    ...state,
    gameState: {
      ...state.gameState,
      activePlayer: otherPlayer.id,
      data: {
        ...data,
        flippedIndices: [],
        activePlayer: otherPlayer.id,
      },
    },
  }
}

// ─── Pictionary: Start Round ───
function startPictionaryRound(state: RoomState): RoomState {
  if (!state.gameState) return state
  const data = state.gameState.data as PictionaryData
  if (data.type !== 'pictionary') return state

  if (data.roundsPlayed >= data.maxRounds) {
    return {
      ...state,
      gameState: { ...state.gameState, phase: 'results', data: { ...data, phase: 'finished' } },
    }
  }

  const result = getRandomPictionaryWord(data.wordsUsedIndices)
  const newDrawer = data.drawer === state.players[0].id ? state.players[1].id : state.players[0].id
  const newGuesser = data.drawer

  return {
    ...state,
    gameState: {
      ...state.gameState,
      activePlayer: newDrawer,
      round: data.roundsPlayed + 1,
      data: {
        ...data,
        word: { es: result.word.es, zh: result.word.zh, pinyin: result.word.pinyin, category: result.word.category },
        drawer: newDrawer,
        guesser: newGuesser,
        guesses: [],
        timeRemaining: 60,
        roundStartedAt: Date.now(),
        wordsUsedIndices: [...data.wordsUsedIndices, result.index],
        phase: 'drawing',
      },
    },
  }
}

// ─── Pictionary: Submit Guess ───
function submitGuess(state: RoomState, playerId: string, guess: string): RoomState {
  if (!state.gameState) return state
  const data = state.gameState.data as PictionaryData
  if (data.type !== 'pictionary' || data.phase !== 'drawing') return state
  if (playerId !== data.guesser) return state

  const normalizedGuess = guess.toLowerCase().trim()
  const isCorrect =
    normalizedGuess === data.word.es.toLowerCase() ||
    normalizedGuess === data.word.zh

  const newGuesses = [...data.guesses, guess]

  if (isCorrect) {
    const players = state.players.map((p) => ({
      ...p,
      score: p.score + (p.id === data.drawer ? 50 : 100),
    }))

    return {
      ...state,
      players,
      gameState: {
        ...state.gameState,
        data: {
          ...data,
          guesses: newGuesses,
          phase: 'guessed',
          roundsPlayed: data.roundsPlayed + 1,
        },
      },
    }
  }

  return {
    ...state,
    gameState: {
      ...state.gameState,
      data: { ...data, guesses: newGuesses },
    },
  }
}

// ─── Pictionary: Timeout ───
function pictionaryTimeout(state: RoomState): RoomState {
  if (!state.gameState) return state
  const data = state.gameState.data as PictionaryData
  if (data.type !== 'pictionary' || data.phase !== 'drawing') return state

  return {
    ...state,
    gameState: {
      ...state.gameState,
      data: {
        ...data,
        phase: 'timeout',
        roundsPlayed: data.roundsPlayed + 1,
      },
    },
  }
}

// ─── Truth or Dare: Spin Wheel ───
function spinWheel(state: RoomState): RoomState {
  if (!state.gameState) return state
  const data = state.gameState.data as TruthDareData
  if (data.type !== 'truth-dare') return state

  const chosenIndex = Math.floor(Math.random() * state.players.length)
  const chosenPlayer = state.players[chosenIndex]
  // Landing zone: player 0 = top (0°), player 1 = bottom (180°)
  // Add random offset within the half for visual variety
  const baseAngle = chosenIndex === 0 ? 0 : 180
  const randomOffset = Math.floor(Math.random() * 120) - 60 // -60 to +60 within the half
  const fullSpins = 360 * (6 + Math.floor(Math.random() * 4)) // 6-9 full spins
  const spinAngle = fullSpins + baseAngle + randomOffset

  return {
    ...state,
    gameState: {
      ...state.gameState,
      data: {
        ...data,
        chosenPlayer: chosenPlayer.id,
        spinAngle,
        phase: 'spinning',
      },
    },
  }
}

// ─── Truth or Dare: Spin Complete → Choosing ───
function spinComplete(state: RoomState): RoomState {
  if (!state.gameState) return state
  const data = state.gameState.data as TruthDareData
  if (data.type !== 'truth-dare' || data.phase !== 'spinning') return state

  return {
    ...state,
    gameState: {
      ...state.gameState,
      data: { ...data, phase: 'choosing' },
    },
  }
}

// ─── Truth or Dare: Choose ───
function chooseTruthDare(state: RoomState, choice: 'truth' | 'dare'): RoomState {
  if (!state.gameState) return state
  const data = state.gameState.data as TruthDareData
  if (data.type !== 'truth-dare') return state

  const result = getRandomTruthDareCard(choice, data.usedCardIds)
  if (!result) return state

  return {
    ...state,
    gameState: {
      ...state.gameState,
      data: {
        ...data,
        choice,
        currentCard: { es: result.card.es, zh: result.card.zh, difficulty: result.card.difficulty },
        usedCardIds: [...data.usedCardIds, result.id],
        phase: 'showing-card',
      },
    },
  }
}

// ─── Truth or Dare: Use Pass ───
function usePass(state: RoomState, playerId: string): RoomState {
  if (!state.gameState) return state
  const data = state.gameState.data as TruthDareData
  if (data.type !== 'truth-dare') return state
  if ((data.passesUsed[playerId] || 0) >= 1) return state

  return {
    ...state,
    gameState: {
      ...state.gameState,
      data: {
        ...data,
        passesUsed: { ...data.passesUsed, [playerId]: 1 },
        phase: 'ready',
        chosenPlayer: null,
        choice: null,
        currentCard: null,
      },
    },
  }
}

// ─── Truth or Dare: Vote Completed ───
function voteCompleted(state: RoomState, playerId: string, completed: boolean): RoomState {
  if (!state.gameState) return state
  const data = state.gameState.data as TruthDareData
  if (data.type !== 'truth-dare' || data.phase !== 'showing-card') return state
  if (data.voted) return state
  // Only the OTHER player (not the chosen one) can vote
  if (playerId === data.chosenPlayer) return state

  const pointsMap: Record<string, number> = { easy: 50, medium: 100, hard: 150 }
  const points = completed ? (pointsMap[data.currentCard?.difficulty || 'easy'] || 50) : 0

  const players = state.players.map((p) =>
    p.id === data.chosenPlayer ? { ...p, score: p.score + points } : p
  )

  return {
    ...state,
    players,
    gameState: {
      ...state.gameState,
      data: { ...data, voted: true },
    },
  }
}

// ─── Truth or Dare: Next Round ───
function nextTruthDareRound(state: RoomState): RoomState {
  if (!state.gameState) return state
  const data = state.gameState.data as TruthDareData
  if (data.type !== 'truth-dare') return state

  return {
    ...state,
    gameState: {
      ...state.gameState,
      round: data.roundsPlayed + 1,
      data: {
        ...data,
        chosenPlayer: null,
        choice: null,
        currentCard: null,
        roundsPlayed: data.roundsPlayed + 1,
        voted: false,
        phase: 'ready',
      },
    },
  }
}

// ─── Emoji Charades: Send Emoji ───
function sendEmoji(state: RoomState, playerId: string, emoji: string): RoomState {
  if (!state.gameState) return state
  const data = state.gameState.data as EmojiCharadesData
  if (data.type !== 'emoji-charades' || data.phase !== 'prompting') return state
  if (playerId !== data.prompter) return state
  if (data.emojis.length >= 8) return state

  return {
    ...state,
    gameState: {
      ...state.gameState,
      data: { ...data, emojis: [...data.emojis, emoji] },
    },
  }
}

// ─── Emoji Charades: Clear Emojis ───
function clearEmojis(state: RoomState, playerId: string): RoomState {
  if (!state.gameState) return state
  const data = state.gameState.data as EmojiCharadesData
  if (data.type !== 'emoji-charades' || data.phase !== 'prompting') return state
  if (playerId !== data.prompter) return state

  return {
    ...state,
    gameState: {
      ...state.gameState,
      data: { ...data, emojis: [] },
    },
  }
}

// ─── Emoji Charades: Guess ───
function emojiGuess(state: RoomState, playerId: string, guess: string): RoomState {
  if (!state.gameState) return state
  const data = state.gameState.data as EmojiCharadesData
  if (data.type !== 'emoji-charades' || data.phase !== 'prompting') return state
  if (playerId !== data.guesser) return state

  const normalizedGuess = guess.toLowerCase().trim()
  const isCorrect =
    normalizedGuess === data.currentPrompt?.es.toLowerCase() ||
    normalizedGuess === data.currentPrompt?.zh

  const newGuesses = [...data.guesses, guess]

  if (isCorrect) {
    const players = state.players.map((p) => ({
      ...p,
      score: p.score + (p.id === data.prompter ? 50 : 100),
    }))

    return {
      ...state,
      players,
      gameState: {
        ...state.gameState,
        data: {
          ...data,
          guesses: newGuesses,
          phase: 'guessed',
          roundsPlayed: data.roundsPlayed + 1,
        },
      },
    }
  }

  return {
    ...state,
    gameState: {
      ...state.gameState,
      data: { ...data, guesses: newGuesses },
    },
  }
}

// ─── Emoji Charades: Timeout ───
function emojiTimeout(state: RoomState): RoomState {
  if (!state.gameState) return state
  const data = state.gameState.data as EmojiCharadesData
  if (data.type !== 'emoji-charades' || data.phase !== 'prompting') return state

  return {
    ...state,
    gameState: {
      ...state.gameState,
      data: { ...data, phase: 'timeout', roundsPlayed: data.roundsPlayed + 1 },
    },
  }
}

// ─── Emoji Charades: Next Round ───
function nextEmojiRound(state: RoomState): RoomState {
  if (!state.gameState) return state
  const data = state.gameState.data as EmojiCharadesData
  if (data.type !== 'emoji-charades') return state

  if (data.roundsPlayed >= data.maxRounds) {
    return {
      ...state,
      gameState: { ...state.gameState, phase: 'results', data: { ...data, phase: 'finished' } },
    }
  }

  const { prompt, index } = getRandomEmojiPrompt(data.wordsUsedIndices)
  const newPrompter = data.prompter === state.players[0].id ? state.players[1].id : state.players[0].id
  const newGuesser = data.prompter

  return {
    ...state,
    gameState: {
      ...state.gameState,
      activePlayer: newPrompter,
      round: data.roundsPlayed + 1,
      data: {
        ...data,
        prompter: newPrompter,
        guesser: newGuesser,
        currentPrompt: { es: prompt.es, zh: prompt.zh, category: prompt.category },
        emojis: [],
        guesses: [],
        wordsUsedIndices: [...data.wordsUsedIndices, index],
        roundStartedAt: Date.now(),
        phase: 'prompting',
      },
    },
  }
}
