import { type NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin-config"

export async function GET(request: NextRequest) {
  const checks = {
    envVars: {} as Record<string, boolean>,
    firebaseConnection: false,
    databaseAccess: false,
    errors: [] as string[],
  }

  // Check environment variables
  const requiredEnvVars = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_DATABASE_URL",
    "FIREBASE_SERVICE_ACCOUNT_KEY",
  ]

  for (const envVar of requiredEnvVars) {
    checks.envVars[envVar] = !!process.env[envVar]
    if (!process.env[envVar]) {
      checks.errors.push(`Missing environment variable: ${envVar}`)
    }
  }

  // Test Firebase connection
  try {
    const testRef = adminDb.ref("_healthcheck")
    await testRef.set({ timestamp: Date.now(), status: "ok" })
    const snapshot = await testRef.get()

    if (snapshot.exists()) {
      checks.firebaseConnection = true
      checks.databaseAccess = true
    }

    await testRef.remove()
  } catch (error) {
    checks.errors.push(`Firebase connection failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }

  const allChecked = Object.values(checks.envVars).every(Boolean) && checks.firebaseConnection

  return NextResponse.json({
    success: allChecked,
    checks,
    nextSteps: allChecked
      ? [
          "Firebase is connected and ready!",
          "Start sending IoT data to /api/iot/save-telemetry",
          "View real-time data in the monitoring dashboard at /dashboard/monitoring",
        ]
      : ["Fix the missing environment variables and connection issues listed above"],
  })
}
