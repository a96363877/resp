"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gamepad2, Trophy, RotateCcw } from "lucide-react"
import { submitGameScore } from "../actions/game-actions"

export default function GameInterface() {
  const [score, setScore] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [clickCount, setClickCount] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [gameId, setGameId] = useState<string | null>(null)

  const startGame = async () => {
    // Start game through server action
    const newGameId = await fetch("/api/game/start", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => data.gameId)

    setGameId(newGameId)
    setGameActive(true)
    setScore(0)
    setClickCount(0)
    setTimeLeft(30)

    // Start countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          endGame(newGameId)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const endGame = async (currentGameId: string) => {
    setGameActive(false)

    // Submit score to server
    if (currentGameId) {
      const result = await submitGameScore(currentGameId, score)
      if (result.newBest) {
        setBestScore(result.bestScore)
      }
    }
  }

  const handleClick = async () => {
    if (gameActive && gameId) {
      // Validate click on server
      const response = await fetch("/api/game/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, timestamp: Date.now() }),
      })

      if (response.ok) {
        setScore((prev) => prev + 1)
        setClickCount((prev) => prev + 1)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Gamepad2 className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Secure Click Challenge</CardTitle>
          <CardDescription className="text-gray-600">Server-validated mobile game for Jordan users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{score}</p>
              <p className="text-sm text-gray-600">Current Score</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{bestScore}</p>
              <p className="text-sm text-gray-600">Best Score</p>
            </div>
          </div>

          <div className="text-center">
            <div className={`text-4xl font-bold ${timeLeft <= 10 ? "text-red-600" : "text-gray-800"}`}>{timeLeft}s</div>
            <p className="text-sm text-gray-600">Time Remaining</p>
          </div>

          <div className="text-center">
            {!gameActive && timeLeft === 30 ? (
              <Button onClick={startGame} size="lg" className="w-full h-16 text-lg bg-green-600 hover:bg-green-700">
                Start Secure Game
              </Button>
            ) : gameActive ? (
              <Button
                onClick={handleClick}
                size="lg"
                className="w-full h-16 text-lg bg-blue-600 hover:bg-blue-700 active:scale-95 transition-transform"
              >
                Click Me! ({clickCount})
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <p className="font-bold text-lg">Game Over!</p>
                  <p className="text-sm text-gray-600">Final Score: {score}</p>
                </div>
                <Button onClick={startGame} className="w-full" variant="default">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
              </div>
            )}
          </div>

          <div className="text-center text-xs text-gray-500 border-t pt-4">
            <p>🔒 All validation performed server-side</p>
            <p>🛡️ Anti-cheat protection enabled</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
