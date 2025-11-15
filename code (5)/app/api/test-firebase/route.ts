import { type NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin-config"

export async function GET(request: NextRequest) {
  try {
    // Test write
    await adminDb.ref("test/connection").set({
      timestamp: new Date().toISOString(),
      status: "connected",
    })

    // Test read
    const snapshot = await adminDb.ref("test/connection").get()
    const data = snapshot.val()

    return NextResponse.json({
      success: true,
      message: "Firebase connection successful",
      data: data,
    })
  } catch (error) {
    console.error("Firebase connection error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
