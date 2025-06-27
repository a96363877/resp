"use server"

interface GameScore {
  gameId: string
  score: number
  timestamp: number
}

// Server-side game state management (in production, use database)
const gameScores = new Map<string, GameScore>()
const userBestScores = new Map<string, number>()

export async function submitGameScore(gameId: string, score: number) {
  // Validate game session exists
  if (!gameScores.has(gameId)) {
    throw new Error("Invalid game session")
  }

  const gameData = gameScores.get(gameId)!
  const timePlayed = Date.now() - gameData.timestamp

  // Server-side validation: game should last approximately 30 seconds
  if (timePlayed < 25000 || timePlayed > 35000) {
    throw new Error("Invalid game duration")
  }

  // Server-side validation: reasonable click rate (max 20 clicks per second)
  const maxPossibleScore = Math.floor(timePlayed / 50) // 20 clicks per second
  if (score > maxPossibleScore) {
    throw new Error("Impossible score detected")
  }

  // Update best score (in production, tie to user session/IP)
  const userId = "anonymous" // In production, use actual user ID
  const currentBest = userBestScores.get(userId) || 0
  const newBest = score > currentBest

  if (newBest) {
    userBestScores.set(userId, score)
  }

  // Clean up game session
  gameScores.delete(gameId)

  return {
    success: true,
    newBest,
    bestScore: Math.max(currentBest, score),
  }
}
