import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { gameId, timestamp } = await request.json()

  // Validate game session exists
  global.gameSessions = global.gameSessions || new Map()
  const session = global.gameSessions.get(gameId)

  if (!session) {
    return NextResponse.json({ error: "Invalid game session" }, { status: 400 })
  }

  // Server-side click validation
  const timeSinceStart = Date.now() - session.startTime

  // Game should be active (within 30 seconds)
  if (timeSinceStart > 30000) {
    return NextResponse.json({ error: "Game expired" }, { status: 400 })
  }

  // Rate limiting: max 20 clicks per second
  session.clicks += 1
  const clickRate = session.clicks / (timeSinceStart / 1000)

  if (clickRate > 20) {
    return NextResponse.json({ error: "Click rate too high" }, { status: 429 })
  }

  // Update session
  global.gameSessions.set(gameId, session)

  return NextResponse.json({ success: true })
}
