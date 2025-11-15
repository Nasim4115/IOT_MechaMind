"use client"

import { useEffect, useState } from "react"
import { database, isConfigured } from "@/lib/firebase"
import { ref, onValue, off } from "firebase/database"

export interface TelemetryDataPoint {
  timestamp: number
  speed: number
  temperature: number
  fuelLevel: number
  latitude: number
  longitude: number
  rpms: number
  acceleration: number
}

export function useRealTimeTelemetry(deviceId: string) {
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryDataPoint[]>([])
  const [currentTelemetry, setCurrentTelemetry] = useState<TelemetryDataPoint | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isConfigured || !database) {
      setError("Firebase is not configured.")
      setLoading(false)
      return
    }

    if (!deviceId) return

    const telemetryRef = ref(database, `telemetry_history/${deviceId}`)

    const unsubscribe = onValue(
      telemetryRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val()
          const points: TelemetryDataPoint[] = Object.values(data)
            .sort((a: any, b: any) => a.timestamp - b.timestamp)
            .slice(-60)

          setTelemetryHistory(points)
          if (points.length > 0) {
            setCurrentTelemetry(points[points.length - 1])
          }
        }
        setLoading(false)
      },
      (error) => {
        setError(error.message)
        setLoading(false)
      },
    )

    return () => off(telemetryRef, "value", unsubscribe)
  }, [deviceId])

  return { telemetryHistory, currentTelemetry, loading, error }
}

export function useAllDevicesTelemetry() {
  const [allTelemetry, setAllTelemetry] = useState<Record<string, TelemetryDataPoint>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isConfigured || !database) {
      setError("Firebase is not configured.")
      setLoading(false)
      return
    }

    const vehiclesRef = ref(database, "vehicles")

    const unsubscribe = onValue(
      vehiclesRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val()
          const telemetry: Record<string, TelemetryDataPoint> = {}

          Object.entries(data).forEach(([key, value]: any) => {
            if (value.telemetry) {
              telemetry[key] = value.telemetry
            }
          })

          setAllTelemetry(telemetry)
          setError(null)
        }
        setLoading(false)
      },
      (error) => {
        setError(error.message)
        setLoading(false)
      },
    )

    return () => off(vehiclesRef, "value", unsubscribe)
  }, [])

  return { allTelemetry, loading, error }
}
