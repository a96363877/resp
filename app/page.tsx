import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { validateAccess } from "@/lib/server-validation"
import RestrictedAccess from "@/components/restricted-access"

export default async function Home() {
  const headersList = headers()
  const userAgent = headersList.get("user-agent") || ""
  const forwardedFor = headersList.get("x-forwarded-for") || ""
  const realIp = headersList.get("x-real-ip") || ""

  // Server-side validation - completely hidden from client
  const validation = await validateAccess({
    userAgent,
    ip: forwardedFor || realIp || "127.0.0.1",
  })

  if (validation.hasAccess) {
    redirect("/sxc")
  }

  // Only show restriction details, never the actual validation logic
  return <RestrictedAccess restrictions={validation.publicStatus} />
}
