"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface SetupCheck {
  envVars: Record<string, boolean>
  firebaseConnection: boolean
  databaseAccess: boolean
  errors: string[]
}

export function FirebaseSetupChecker() {
  const [checks, setChecks] = useState<SetupCheck | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const runChecks = async () => {
      try {
        const response = await fetch("/api/firebase-setup/check")
        const data = await response.json()
        setChecks(data.checks)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to run checks")
      } finally {
        setLoading(false)
      }
    }

    runChecks()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Firebase Setup Check</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Running checks...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!checks) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Firebase Setup Status</CardTitle>
        <CardDescription>Environment variables and connection status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold">Environment Variables</h3>
          {Object.entries(checks.envVars).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 text-sm">
              {value ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <span className={value ? "text-green-700" : "text-red-700"}>{key}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Connection Status</h3>
          <div className="flex items-center gap-2 text-sm">
            {checks.firebaseConnection ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <span className={checks.firebaseConnection ? "text-green-700" : "text-red-700"}>
              Firebase Connection: {checks.firebaseConnection ? "Connected" : "Failed"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {checks.databaseAccess ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <span className={checks.databaseAccess ? "text-green-700" : "text-red-700"}>
              Database Access: {checks.databaseAccess ? "Accessible" : "Failed"}
            </span>
          </div>
        </div>

        {checks.errors.length > 0 && (
          <div className="space-y-2 rounded-lg bg-red-50 p-3">
            <h3 className="font-semibold text-red-700">Issues Found</h3>
            <ul className="space-y-1 text-sm text-red-600">
              {checks.errors.map((error, idx) => (
                <li key={idx} className="flex gap-2">
                  <span>•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
