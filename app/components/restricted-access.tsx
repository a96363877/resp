import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Smartphone, MapPin, Shield } from "lucide-react"

interface RestrictedAccessProps {
  restrictions: {
    location: boolean
    device: boolean
    security: boolean
  }
}

export default function RestrictedAccess({ restrictions }: RestrictedAccessProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Access Restricted</CardTitle>
          <CardDescription className="text-gray-600">
            Your device or location doesn't meet the requirements to access this game.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div
              className={`flex items-center p-3 rounded-lg ${
                restrictions.location ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
              }`}
            >
              <MapPin className={`w-5 h-5 mr-3 ${restrictions.location ? "text-green-600" : "text-red-600"}`} />
              <div className="flex-1">
                <p className="font-medium text-sm">Location Requirement</p>
                <p className="text-xs text-gray-600">Must be accessing from Jordan</p>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  restrictions.location ? "bg-green-600" : "bg-red-600"
                }`}
              >
                <span className="text-white text-xs">{restrictions.location ? "✓" : "✗"}</span>
              </div>
            </div>

            <div
              className={`flex items-center p-3 rounded-lg ${
                restrictions.security ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
              }`}
            >
              <Shield className={`w-5 h-5 mr-3 ${restrictions.security ? "text-green-600" : "text-red-600"}`} />
              <div className="flex-1">
                <p className="font-medium text-sm">Security Verification</p>
                <p className="text-xs text-gray-600">Must pass security validation</p>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  restrictions.security ? "bg-green-600" : "bg-red-600"
                }`}
              >
                <span className="text-white text-xs">{restrictions.security ? "✓" : "✗"}</span>
              </div>
            </div>

            <div
              className={`flex items-center p-3 rounded-lg ${
                restrictions.device ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
              }`}
            >
              <Smartphone className={`w-5 h-5 mr-3 ${restrictions.device ? "text-green-600" : "text-red-600"}`} />
              <div className="flex-1">
                <p className="font-medium text-sm">Device Requirement</p>
                <p className="text-xs text-gray-600">Must be using a mobile device</p>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  restrictions.device ? "bg-green-600" : "bg-red-600"
                }`}
              >
                <span className="text-white text-xs">{restrictions.device ? "✓" : "✗"}</span>
              </div>
            </div>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-xs text-gray-500">Access requirements are validated server-side for security.</p>
            <p className="text-xs text-gray-500 mt-1">If you believe this is an error, please contact support.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
