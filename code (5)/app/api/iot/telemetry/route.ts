import { adminDb } from "@/lib/firebase-admin"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { deviceId, driverId, latitude, longitude, speed, temperature, fuelLevel, status } = await req.json()

    if (!deviceId || !driverId) {
      return NextResponse.json({ error: "Missing deviceId or driverId" }, { status: 400 })
    }

    const timestamp = Date.now()
    const telemetryData = {
      deviceId,
      driverId,
      latitude,
      longitude,
      speed,
      temperature,
      fuelLevel,
      status,
      timestamp,
    }

    // Store telemetry data in Firebase
    await adminDb.ref(`vehicles/${deviceId}/telemetry`).set(telemetryData)
    await adminDb.ref(`telemetry_history/${deviceId}/${timestamp}`).set(telemetryData)

    // Update vehicle status
    await adminDb.ref(`vehicles/${deviceId}/lastUpdate`).set(timestamp)

    return NextResponse.json({ success: true, timestamp })
  } catch (error) {
    console.error("[v0] IoT telemetry error:", error)
    return NextResponse.json({ error: "Failed to process telemetry" }, { status: 500 })
  }
}
