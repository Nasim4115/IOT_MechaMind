class WebSocketManager {
  private ws: WebSocket | null = null
  private subscribers: Map<string, Set<Function>> = new Map()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 3000

  connect(url: string) {
    try {
      this.ws = new WebSocket(url)

      this.ws.onopen = () => {
        console.log("[v0] WebSocket connected")
        this.reconnectAttempts = 0
      }

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        this.notifySubscribers(data.type, data.payload)
      }

      this.ws.onerror = (error) => {
        console.error("[v0] WebSocket error:", error)
      }

      this.ws.onclose = () => {
        this.attemptReconnect(url)
      }
    } catch (error) {
      console.error("[v0] WebSocket connection failed:", error)
    }
  }

  private attemptReconnect(url: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`[v0] Attempting reconnection (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      setTimeout(() => this.connect(url), this.reconnectDelay)
    }
  }

  subscribe(eventType: string, callback: Function) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set())
    }
    this.subscribers.get(eventType)!.add(callback)

    return () => {
      this.subscribers.get(eventType)?.delete(callback)
    }
  }

  private notifySubscribers(eventType: string, payload: any) {
    const callbacks = this.subscribers.get(eventType)
    if (callbacks) {
      callbacks.forEach((callback) => callback(payload))
    }
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

export const wsManager = new WebSocketManager()
