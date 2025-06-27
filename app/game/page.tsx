import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { validateAccess } from "../lib/server-validation"
import GameInterface from "./components/game-interface"

export default async function GamePage() {
  const headersList = headers()
  const userAgent = headersList.get("user-agent") || ""
  const forwardedFor = headersList.get("x-forwarded-for") || ""
  const realIp = headersList.get("x-real-ip") || ""

  // Re-validate access on game page (security)
  const validation = await validateAccess({
    userAgent,
    ip: forwardedFor || realIp || "127.0.0.1",
  })

  if (!validation.hasAccess) {
    redirect("/")
  }

  return <GameInterface />
}
