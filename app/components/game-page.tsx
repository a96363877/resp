"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gamepad2, Trophy, RotateCcw, Home } from "lucide-react"

export default function GamePage() {
  const [score, setScore] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [clickCount, setClickCount] = useState(0)
  const [bestScore, setBestScore] = useState(0)

  useEffect(() => {
    // Load best score from localStorage
    const saved = localStorage.getItem("bestScore")
    if (saved) {
      setBestScore(Number.parseInt(saved))
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      endGame()
    }
    return () => clearInterval(interval)
  }, [gameActive, timeLeft])

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setClickCount(0)
    setTimeLeft(30)
  }

  const endGame = () => {
    setGameActive(false)
    if (score > bestScore) {
      setBestScore(score)
      localStorage.setItem("bestScore", score.toString())
    }
  }

  const handleClick = () => {
    if (gameActive) {
      setScore((prev) => prev + 1)
      setClickCount((prev) => prev + 1)
    }
  }

  const resetGame = () => {
    setGameActive(false)
    setScore(0)
    setClickCount(0)
    setTimeLeft(30)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Gamepad2 className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Click Challenge</CardTitle>
          <CardDescription className="text-gray-600">Click as fast as you can in 30 seconds!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Game Stats */}
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

          {/* Timer */}
          <div className="text-center">
            <div className={`text-4xl font-bold ${timeLeft <= 10 ? "text-red-600" : "text-gray-800"}`}>{timeLeft}s</div>
            <p className="text-sm text-gray-600">Time Remaining</p>
          </div>

          {/* Game Button */}
          <div className="text-center">
            {!gameActive && timeLeft === 30 ? (
              <Button onClick={startGame} size="lg" className="w-full h-16 text-lg bg-green-600 hover:bg-green-700">
                Start Game
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
                  {score === bestScore && score > 0 && (
                    <p className="text-sm text-green-600 font-medium">🎉 New Best Score!</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={startGame} className="flex-1" variant="default">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Play Again
                  </Button>
                  <Button onClick={resetGame} variant="outline" className="flex-1 bg-transparent">
                    <Home className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="text-center text-sm text-gray-500 border-t pt-4">
            <p>✅ From Jordan • ✅ Mobile Device • ✅ Human Verified</p>
            <p className="mt-1">Access granted! Enjoy the game.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
