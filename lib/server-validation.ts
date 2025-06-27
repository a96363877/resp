interface ValidationInput {
  userAgent: string
  ip: string
}

interface ValidationResult {
  hasAccess: boolean
  publicStatus: {
    isFromJordan: boolean
    isNotBot: boolean
    isMobile: boolean
  }
}

export async function validateAccess({ userAgent, ip }: ValidationInput): Promise<ValidationResult> {
  // Server-side validation logic
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  const isNotBot = !/bot|crawler|spider|crawling/i.test(userAgent)

  // Check location (you would implement actual IP geolocation here)
  let isFromJordan = false
  try {
    // In a real implementation, you'd use a server-side IP geolocation service
    // For now, we'll simulate this check
    const response = await fetch(`https://ipapi.co/${ip}/json/`)
    const data = await response.json()
    isFromJordan = data.country_code === "JO"
  } catch (error) {
    console.error("Server-side location check failed:", error)
    // Default to false for security
    isFromJordan = false
  }

  const hasAccess = isFromJordan && isNotBot && isMobile

  return {
    hasAccess,
    publicStatus: {
      isFromJordan,
      isNotBot,
      isMobile,
    },
  }
}
