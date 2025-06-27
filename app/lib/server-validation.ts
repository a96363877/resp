interface ValidationRequest {
  userAgent: string
  ip: string
}

interface ValidationResult {
  hasAccess: boolean
  publicStatus: {
    location: boolean
    device: boolean
    security: boolean
  }
}

export async function validateAccess({ userAgent, ip }: ValidationRequest): Promise<ValidationResult> {
  // All validation logic hidden on server

  // 1. Mobile device check (server-side)
  const isMobile = checkMobileDevice(userAgent)

  // 2. Bot detection (server-side)
  const isNotBot = await checkBotDetection(userAgent, ip)

  // 3. Location check (server-side)
  const isFromJordan = await checkLocation(ip)

  const hasAccess = isMobile && isNotBot && isFromJordan

  return {
    hasAccess,
    publicStatus: {
      device: isMobile,
      security: isNotBot,
      location: isFromJordan,
    },
  }
}

function checkMobileDevice(userAgent: string): boolean {
  // Server-side mobile detection with more sophisticated checks
  const mobilePatterns = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
    /Mobile/i,
    /Tablet/i,
  ]

  return mobilePatterns.some((pattern) => pattern.test(userAgent))
}

async function checkBotDetection(userAgent: string, ip: string): Promise<boolean> {
  // Advanced bot detection logic (hidden from client)
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /go-http/i,
    /axios/i,
    /fetch/i,
  ]

  // Check user agent for bot patterns
  const hasBot = botPatterns.some((pattern) => pattern.test(userAgent))
  if (hasBot) return false

  // Additional server-side checks
  const hasValidHeaders = userAgent.length > 10 && userAgent.includes("Mozilla")

  // Could add more sophisticated checks here:
  // - Rate limiting
  // - IP reputation checks
  // - Browser fingerprinting validation

  return hasValidHeaders
}

async function checkLocation(ip: string): Promise<boolean> {
  try {
    // Use server-side IP geolocation (more reliable)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`, {
      headers: {
        "User-Agent": "Server-Validation/1.0",
      },
    })

    if (!response.ok) {
      // Fallback: deny access if location check fails
      return false
    }

    const data = await response.json()
    return data.countryCode === "JO"
  } catch (error) {
    console.error("Location check failed:", error)
    // Security: deny access on error
    return false
  }
}
