"use client"

import { useEffect, useState } from "react"
import { database, isConfigured } from "@/lib/firebase"
import { ref, onValue, query, limitToLast } from "firebase/database"

export interface Alert {
  id: string
  deviceId: string
  driverId: string
  alertType: string
  severity: "low" | "medium" | "high"
  message: string
  timestamp: number
  resolved: boolean
}

export function useActiveAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isConfigured || !database) {
      setError("Firebase is not configured.")
      setLoading(false)
      return
    }

    const alertsRef = query(ref(database, "alerts"), limitToLast(50))

    const unsubscribe = onValue(
      alertsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val()
          const alertList: Alert[] = Object.values(data)
            .filter((alert: any) => !alert.resolved)
            .sort((a: any, b: any) => b.timestamp - a.timestamp)

          setAlerts(alertList)
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

  return { alerts, loading, error }
}
