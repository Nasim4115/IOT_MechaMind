"use client"

import { database, isConfigured } from "@/lib/firebase"
import { ref, onValue, off } from "firebase/database"
import { useEffect, useState } from "react"

export function useFirebaseRealtimeData(path: string) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isConfigured || !database) {
      setError("Firebase is not configured. Please add environment variables.")
      setLoading(false)
      return
    }

    setLoading(true)
    const dbRef = ref(database, path)

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val())
        }
        setError(null)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
    )

    return () => off(dbRef)
  }, [path])

  return { data, loading, error }
}
