import { adminDb } from "@/lib/firebase-admin-config"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const deviceId = searchParams.get("deviceId")

    if (!deviceId) {
      return NextResponse.json({ error: "Missing deviceId parameter" }, { status: 400 })
    }

    const snapshot = await adminDb.ref(`devices/${deviceId}/current`).get()

    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 })
    }

    return NextResponse.json(snapshot.val())
  } catch (error) {
    console.error("Get device data error:", error)
    return NextResponse.json({ error: "Failed to fetch device data" }, { status: 500 })
  }
}
