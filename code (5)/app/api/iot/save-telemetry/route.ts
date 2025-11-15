import { adminDb } from "@/lib/firebase-admin-config"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { deviceId, driverId, latitude, longitude, speed, temperature, fuelLevel, status } = data

    if (!deviceId || !driverId) {
      return NextResponse.json({ error: "Missing deviceId or driverId" }, { status: 400 })
    }

    const timestamp = Date.now()
    const telemetryRef = adminDb.ref(`telemetry/${deviceId}/${timestamp}`)

    await telemetryRef.set({
      driverId,
      latitude,
      longitude,
      speed,
      temperature,
      fuelLevel,
      status,
      timestamp,
      recordedAt: new Date().toISOString(),
    })

    await adminDb.ref(`devices/${deviceId}/current`).set({
      driverId,
      latitude,
      longitude,
      speed,
      temperature,
      fuelLevel,
      status,
      lastUpdate: timestamp,
    })

    return NextResponse.json({ success: true, timestamp })
  } catch (error) {
    console.error("Telemetry save error:", error)
    return NextResponse.json({ error: "Failed to save telemetry" }, { status: 500 })
  }
}
