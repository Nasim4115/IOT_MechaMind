import { database, isConfigured } from "@/lib/firebase"
import { ref, get } from "firebase/database"

export async function getDashboardMetrics() {
  if (!isConfigured || !database) return null

  try {
    const metricsRef = ref(database, "metrics")
    const snapshot = await get(metricsRef)
    return snapshot.exists() ? snapshot.val() : null
  } catch (error) {
    console.error("[v0] Error fetching dashboard metrics:", error)
    return null
  }
}

export async function getRides() {
  if (!isConfigured || !database) return []

  try {
    const ridesRef = ref(database, "rides")
    const snapshot = await get(ridesRef)
    if (!snapshot.exists()) return []
    
    const data = snapshot.val()
    return Object.entries(data).map(([id, ride]: [string, any]) => ({
      id,
      ...ride,
    }))
  } catch (error) {
    console.error("[v0] Error fetching rides:", error)
    return []
  }
}

export async function getUsers() {
  if (!isConfigured || !database) return []

  try {
    const usersRef = ref(database, "users")
    const snapshot = await get(usersRef)
    if (!snapshot.exists()) return []
    
    const data = snapshot.val()
    return Object.entries(data).map(([id, user]: [string, any]) => ({
      id,
      ...user,
    }))
  } catch (error) {
    console.error("[v0] Error fetching users:", error)
    return []
  }
}

export async function getDrivers() {
  if (!isConfigured || !database) return []

  try {
    const driversRef = ref(database, "drivers")
    const snapshot = await get(driversRef)
    if (!snapshot.exists()) return []
    
    const data = snapshot.val()
    return Object.entries(data).map(([id, driver]: [string, any]) => ({
      id,
      ...driver,
    }))
  } catch (error) {
    console.error("[v0] Error fetching drivers:", error)
    return []
  }
}

export async function getAnalytics() {
  if (!isConfigured || !database) return null

  try {
    const analyticsRef = ref(database, "analytics")
    const snapshot = await get(analyticsRef)
    return snapshot.exists() ? snapshot.val() : null
  } catch (error) {
    console.error("[v0] Error fetching analytics:", error)
    return null
  }
}
