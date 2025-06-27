import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { validateAccess } from "../../../lib/server-validation"

export async function POST() {
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") || ""
  const forwardedFor = headersList.get("x-forwarded-for") || ""
  const realIp = headersList.get("x-real-ip") || ""

  // Re-validate access before starting game
  const validation = await validateAccess({
    userAgent,
    ip: forwardedFor || realIp || "127.0.0.1",
  })

  if (!validation.hasAccess) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 })
  }

  // Generate secure game ID
  const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // Store game session (in production, use database/Redis)
  // This is a simplified in-memory storage
  global.gameSessions = global.gameSessions || new Map()
  global.gameSessions.set(gameId, {
    startTime: Date.now(),
    clicks: 0,
    ip: forwardedFor || realIp || "127.0.0.1",
  })

  return NextResponse.json({ gameId })
}
