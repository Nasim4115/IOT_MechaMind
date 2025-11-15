import { adminDb } from "@/lib/firebase-admin"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const deviceId = req.nextUrl.searchParams.get("deviceId")

  if (!deviceId) {
    return NextResponse.json({ error: "deviceId required" }, { status: 400 })
  }

  // Create response stream
  const encoder = new TextEncoder()
  const customReadable = new ReadableStream({
    async start(controller) {
      const streamInterval = setInterval(async () => {
        try {
          const snapshot = await adminDb.ref(`vehicles/${deviceId}/telemetry`).get()
          if (snapshot.exists()) {
            const data = snapshot.val()
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
          }
        } catch (error) {
          console.error("[v0] Stream error:", error)
          clearInterval(streamInterval)
          controller.close()
        }
      }, 1000)

      return () => clearInterval(streamInterval)
    },
  })

  return new NextResponse(customReadable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
