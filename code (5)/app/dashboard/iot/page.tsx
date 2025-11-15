"use client"

import { VehicleTrackingMap } from "@/components/vehicle-tracking-map"
import { IoTAlertsPanel } from "@/components/iot-alerts-panel"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { isConfigured } from "@/lib/firebase"

export default function IoTDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">IoT Vehicle Monitoring</h1>
        <p className="text-muted-foreground mt-2">Real-time tracking and telemetry from connected IoT devices</p>
      </div>

      {!isConfigured && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Firebase is not configured. Please add the required environment variables in the Vars section to enable
            real-time monitoring.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <VehicleTrackingMap />
        </div>
        <div>
          <IoTAlertsPanel />
        </div>
      </div>
    </div>
  )
}
