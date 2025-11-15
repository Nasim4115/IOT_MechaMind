import { adminDb } from "@/lib/firebase-admin"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { deviceId, driverId, alertType, severity, message, data } = await req.json()

    if (!deviceId || !alertType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const alertId = Date.now().toString()
    const alertData = {
      id: alertId,
      deviceId,
      driverId,
      alertType, // 'overspeed', 'temperature', 'fuel_low', 'harsh_driving', etc.
      severity, // 'low', 'medium', 'high'
      message,
      data,
      timestamp: Date.now(),
      resolved: false,
    }

    // Store alert
    await adminDb.ref(`alerts/${alertId}`).set(alertData)
    await adminDb.ref(`vehicles/${deviceId}/activeAlerts/${alertId}`).set(true)

    return NextResponse.json({ success: true, alertId })
  } catch (error) {
    console.error("[v0] IoT alert error:", error)
    return NextResponse.json({ error: "Failed to process alert" }, { status: 500 })
  }
}
