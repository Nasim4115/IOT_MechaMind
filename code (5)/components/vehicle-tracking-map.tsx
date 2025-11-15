"use client"

import { useAllVehicles } from "@/hooks/use-firebase-telemetry"
import { useActiveAlerts } from "@/hooks/use-firebase-alerts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Droplet } from "lucide-react"

export function VehicleTrackingMap() {
  const { vehicles, loading } = useAllVehicles()
  const { alerts } = useActiveAlerts()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Vehicle Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  const vehicleCount = Object.keys(vehicles).length
  const activeAlerts = alerts.filter((a) => !a.resolved)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Live Vehicle Tracking</CardTitle>
        <Badge variant="secondary">{vehicleCount} Active</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Map placeholder - integrate with Google Maps or Mapbox */}
          <div className="h-96 bg-muted rounded-lg flex items-center justify-center border border-border">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">Map view - Integrate with Google Maps API</div>
              <div className="text-lg font-semibold">{vehicleCount} Vehicles Active</div>
            </div>
          </div>

          {/* Vehicle List */}
          <div className="grid gap-3 mt-4">
            {Object.entries(vehicles).map(([deviceId, telemetry]) => (
              <div key={deviceId} className="p-3 border border-border rounded-lg bg-card hover:bg-accent/50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium">
                      Device: {deviceId.slice(0, 8)}... | Driver: {telemetry.driverId}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Location: {telemetry.latitude?.toFixed(4)}, {telemetry.longitude?.toFixed(4)}
                    </div>
                    <div className="flex gap-3 mt-2 text-sm">
                      <span>Speed: {telemetry.speed} km/h</span>
                      <span>Status: {telemetry.status}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge variant={telemetry.speed > 80 ? "destructive" : "outline"}>{telemetry.speed} km/h</Badge>
                    <div className="flex gap-1">
                      <div className="flex items-center gap-1 text-xs bg-background px-2 py-1 rounded">
                        <Zap className="w-3 h-3" />
                        {telemetry.temperature}°C
                      </div>
                      <div className="flex items-center gap-1 text-xs bg-background px-2 py-1 rounded">
                        <Droplet className="w-3 h-3" />
                        {telemetry.fuelLevel}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {vehicleCount === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No active vehicles. Configure IoT devices to start tracking.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
