import { adminDb } from "@/lib/firebase-admin-config"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const deviceId = searchParams.get("deviceId")
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    if (!deviceId) {
      return NextResponse.json({ error: "Missing deviceId parameter" }, { status: 400 })
    }

    const snapshot = await adminDb.ref(`telemetry/${deviceId}`).orderByChild("timestamp").limitToLast(limit).get()

    if (!snapshot.exists()) {
      return NextResponse.json({ telemetry: [] })
    }

    const data = snapshot.val()
    const telemetry = Object.values(data).reverse()

    return NextResponse.json({ telemetry })
  } catch (error) {
    console.error("Get telemetry history error:", error)
    return NextResponse.json({ error: "Failed to fetch telemetry history" }, { status: 500 })
  }
}
