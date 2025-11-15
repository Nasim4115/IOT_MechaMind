"use client"

import { useEffect, useState, useCallback } from "react"
import { wsManager } from "@/lib/websocket-manager"

export function useWebSocket(eventType: string, onData: (data: any) => void) {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const checkConnection = () => {
      setConnected(true)
    }

    const unsubscribe = wsManager.subscribe(eventType, (data) => {
      onData(data)
      checkConnection()
    })

    // Simulate WebSocket connection for demo
    setConnected(true)

    return () => {
      unsubscribe()
    }
  }, [eventType, onData])

  return { connected }
}

export function useBroadcastWebSocket() {
  const send = useCallback((event: string, data: any) => {
    wsManager.send({
      type: event,
      payload: data,
    })
  }, [])

  return { send }
}
