'use client'

import { useEffect, useState } from 'react'
import { database } from '@/lib/firebase'
import { ref, onValue, off } from 'firebase/database'

interface Driver {
  id: string
  name: string
  email?: string
  phone?: string
  vehicle?: string
  vehicleNumber?: string
  rating?: number
  totalEarnings?: number
  monthlyEarnings?: number
  totalRides?: number
  points?: number
  completionRate?: number
  joinDate?: string
  licenseNumber?: string
  status?: string
  [key: string]: any
}

export function useRealtimeDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const driversRef = ref(database, 'drivers')

      const unsubscribe = onValue(
        driversRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val()
            const driversList = Object.entries(data).map(([id, driver]: [string, any]) => ({
              id,
              ...driver,
            }))
            setDrivers(driversList)
          } else {
            setDrivers([])
          }
          setLoading(false)
        },
        (err) => {
          console.error('[v0] Error listening to drivers:', err)
          setError('Failed to load driver data')
          setLoading(false)
        }
      )

      return () => {
        off(driversRef)
      }
    } catch (err) {
      console.error('[v0] Error setting up driver listener:', err)
      setError('Failed to connect to driver data')
      setLoading(false)
    }
  }, [])

  return { drivers, loading, error }
}
