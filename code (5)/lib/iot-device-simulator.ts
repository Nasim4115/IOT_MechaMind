// Simulates IoT device telemetry for testing
export async function sendMockIoTData() {
  const devices = [
    { deviceId: "GPS-001", driverId: "DRV-001" },
    { deviceId: "GPS-002", driverId: "DRV-002" },
    { deviceId: "GPS-003", driverId: "DRV-003" },
  ]

  for (const device of devices) {
    const telemetry = {
      deviceId: device.deviceId,
      driverId: device.driverId,
      latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
      longitude: -74.006 + (Math.random() - 0.5) * 0.1,
      speed: Math.floor(Math.random() * 100),
      temperature: 60 + Math.floor(Math.random() * 20),
      fuelLevel: 20 + Math.floor(Math.random() * 80),
      status: "active",
    }

    try {
      await fetch("/api/iot/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(telemetry),
      })

      // Random alert simulation
      if (Math.random() > 0.95) {
        await fetch("/api/iot/alert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            deviceId: device.deviceId,
            driverId: device.driverId,
            alertType: "overspeed",
            severity: "high",
            message: `Vehicle exceeding speed limit at ${telemetry.speed} km/h`,
            data: { currentSpeed: telemetry.speed, limit: 80 },
          }),
        })
      }
    } catch (error) {
      console.error("[v0] Failed to send mock data:", error)
    }
  }
}
