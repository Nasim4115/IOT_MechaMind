"use client"

import { useEffect, useState } from "react"
import { database, isConfigured } from "@/lib/firebase"
import { ref, onValue } from "firebase/database"

export interface VehicleTelemetry {
  deviceId: string
  driverId: string
  latitude: number
  longitude: number
  speed: number
  temperature: number
  fuelLevel: number
  status: string
  timestamp: number
}

export function useFirebaseTelemetry(deviceId?: string) {
  const [telemetry, setTelemetry] = useState<VehicleTelemetry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isConfigured || !database) {
      setError("Firebase is not configured. Please add environment variables.")
      setLoading(false)
      return
    }

    if (!deviceId) {
      setLoading(false)
      return
    }

    const telemetryRef = ref(database, `vehicles/${deviceId}/telemetry`)

    const unsubscribe = onValue(
      telemetryRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setTelemetry(snapshot.val())
          setError(null)
        } else {
          setTelemetry(null)
        }
        setLoading(false)
      },
      (error) => {
        setError(error.message)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [deviceId])

  return { telemetry, loading, error }
}

export function useAllVehicles() {
  const [vehicles, setVehicles] = useState<Record<string, VehicleTelemetry>>({})
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
          const activeVehicles: Record<string, VehicleTelemetry> = {}

          Object.entries(data).forEach(([key, value]: any) => {
            if (value.telemetry) {
              activeVehicles[key] = value.telemetry
            }
          })

          setVehicles(activeVehicles)
          setError(null)
        }
        setLoading(false)
      },
      (error) => {
        setError(error.message)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  return { vehicles, loading, error }
}
