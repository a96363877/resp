"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Smartphone, MapPin, Shield } from "lucide-react"

interface RestrictionStatus {
  isFromJordan: boolean
  isNotBot: boolean
  isMobile: boolean
}

interface RestrictedAccessProps {
  restrictions: RestrictionStatus
}

export default function RestrictedAccess({ restrictions }: RestrictedAccessProps) {
  const [isChecking, setIsChecking] = useState(false)
  const [clientRestrictions, setClientRestrictions] = useState<RestrictionStatus>(restrictions)

  const checkRestrictions = async () => {
    setIsChecking(true)

    try {
      // Check if mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      // Check if not a bot (basic detection)
      const isNotBot =
        !/bot|crawler|spider|crawling/i.test(navigator.userAgent) &&
        navigator.webdriver !== true &&
        window.navigator.languages !== undefined

      // Check location (Jordan)
      let isFromJordan = false
      try {
        const response = await fetch("https://ipapi.co/json/")
        const data = await response.json()
        isFromJordan = data.country_code === "JO"
      } catch (error) {
        console.error("Location check failed:", error)
        // Fallback: allow access if location check fails
        isFromJordan = true
      }

      setClientRestrictions({
        isFromJordan,
        isNotBot,
        isMobile,
      })

      // If all restrictions are met, redirect
      if (isFromJordan && isNotBot && isMobile) {
        window.location.href = "https://google.com"
      }
    } catch (error) {
      console.error("Failed to verify access requirements:", error)
    } finally {
      setIsChecking(false)
    }
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-lg font-medium text-gray-700">Verifying access...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait while we check your eligibility</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Access Restricted</CardTitle>
          <CardDescription className="text-gray-600">
            Your device or location doesn't meet the requirements to access this application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div
              className={`flex items-center p-3 rounded-lg ${
                clientRestrictions.isFromJordan
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <MapPin
                className={`w-5 h-5 mr-3 ${clientRestrictions.isFromJordan ? "text-green-600" : "text-red-600"}`}
              />
              <div className="flex-1">
                <p className="font-medium text-sm">Location Requirement</p>
                <p className="text-xs text-gray-600">Must be accessing from Jordan</p>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  clientRestrictions.isFromJordan ? "bg-green-600" : "bg-red-600"
                }`}
              >
                <span className="text-white text-xs">{clientRestrictions.isFromJordan ? "✓" : "✗"}</span>
              </div>
            </div>

            <div
              className={`flex items-center p-3 rounded-lg ${
                clientRestrictions.isNotBot ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
              }`}
            >
              <Shield className={`w-5 h-5 mr-3 ${clientRestrictions.isNotBot ? "text-green-600" : "text-red-600"}`} />
              <div className="flex-1">
                <p className="font-medium text-sm">Human Verification</p>
                <p className="text-xs text-gray-600">Must be a human user, not a bot</p>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  clientRestrictions.isNotBot ? "bg-green-600" : "bg-red-600"
                }`}
              >
                <span className="text-white text-xs">{clientRestrictions.isNotBot ? "✓" : "✗"}</span>
              </div>
            </div>

            <div
              className={`flex items-center p-3 rounded-lg ${
                clientRestrictions.isMobile ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
              }`}
            >
              <Smartphone
                className={`w-5 h-5 mr-3 ${clientRestrictions.isMobile ? "text-green-600" : "text-red-600"}`}
              />
              <div className="flex-1">
                <p className="font-medium text-sm">Device Requirement</p>
                <p className="text-xs text-gray-600">Must be using a mobile device</p>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  clientRestrictions.isMobile ? "bg-green-600" : "bg-red-600"
                }`}
              >
                <span className="text-white text-xs">{clientRestrictions.isMobile ? "✓" : "✗"}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button onClick={checkRestrictions} className="w-full" disabled={isChecking}>
              {isChecking ? "Checking..." : "Check Again"}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">If you believe this is an error, please contact support.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
