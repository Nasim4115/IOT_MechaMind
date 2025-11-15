// Database Schema Documentation
//
// Structure:
// /devices/{deviceId}/current
//   - driverId: string
//   - latitude: number
//   - longitude: number
//   - speed: number
//   - temperature: number
//   - fuelLevel: number
//   - status: 'active' | 'idle' | 'offline'
//   - lastUpdate: timestamp
//
// /telemetry/{deviceId}/{timestamp}
//   - driverId: string
//   - latitude: number
//   - longitude: number
//   - speed: number
//   - temperature: number
//   - fuelLevel: number
//   - status: string
//   - timestamp: number
//   - recordedAt: ISO string
//
// /alerts/{alertId}
//   - deviceId: string
//   - type: 'overspeed' | 'temp_warning' | 'low_fuel'
//   - severity: 'low' | 'medium' | 'critical'
//   - message: string
//   - timestamp: number

export const DATABASE_SCHEMA = {
  DEVICE_CURRENT: (deviceId: string) => `devices/${deviceId}/current`,
  DEVICE_TELEMETRY: (deviceId: string) => `telemetry/${deviceId}`,
  ALERTS: "alerts",
}
