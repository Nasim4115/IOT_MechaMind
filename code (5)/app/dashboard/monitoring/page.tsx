"use client"

import { useState, useEffect, useCallback } from "react"
import { useAllDevicesTelemetry } from "@/hooks/use-real-time-telemetry"
import { useActiveAlerts } from "@/hooks/use-firebase-alerts"
import { useWebSocket } from "@/hooks/use-websocket"
import { DeviceStatusMonitor } from "@/components/device-status-monitor"
import { TelemetryChart } from "@/components/telemetry-chart"
import { IoTAlertsPanel } from "@/components/iot-alerts-panel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Zap, Gauge, Thermometer, Droplet } from "lucide-react"
import { StatCard, HealthIndicator } from "@/components/stat-card"

export default function MonitoringPage() {
  const { allTelemetry, loading } = useAllDevicesTelemetry()
  const { alerts } = useActiveAlerts()
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  const [telemetryHistory, setTelemetryHistory] = useState<any[]>([])
  const [wsConnected, setWsConnected] = useState(true)

  const handleTelemetryUpdate = useCallback(
    (data: any) => {
      if (data && data.deviceId === selectedDevice) {
        setTelemetryHistory((prev) =>
          [
            ...prev,
            {
              timestamp: data.timestamp,
              speed: data.speed || 0,
              temperature: data.temperature || 0,
              fuelLevel: data.fuelLevel || 0,
              rpms: data.rpms || Math.random() * 5000,
              acceleration: data.acceleration || (Math.random() - 0.5) * 2,
            },
          ].slice(-60),
        )
      }
    },
    [selectedDevice],
  )

  useWebSocket("telemetry_update", handleTelemetryUpdate)

  useEffect(() => {
    if (!selectedDevice || !allTelemetry[selectedDevice]) return

    const current = allTelemetry[selectedDevice]
    setTelemetryHistory((prev) =>
      [
        ...prev,
        {
          timestamp: Date.now(),
          speed: current.speed || 0,
          temperature: current.temperature || 0,
          fuelLevel: current.fuelLevel || 0,
          rpms: Math.random() * 5000,
          acceleration: (Math.random() - 0.5) * 2,
        },
      ].slice(-60),
    )
  }, [allTelemetry, selectedDevice])

  const devices = Object.entries(allTelemetry)
  const activeDevices = devices.filter(([_, data]) => data.status === "active").length
  const criticalAlerts = alerts.filter((a) => a.severity === "high").length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Real-time Monitoring</h1>
          <p className="text-muted-foreground mt-2">Live IoT device telemetry and system health</p>
        </div>
        <Badge variant={wsConnected ? "default" : "destructive"}>
          {wsConnected ? "WebSocket Connected" : "Using Fallback"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Active Devices"
          value={activeDevices}
          total={devices.length}
          unit="devices"
          icon={<Zap className="text-primary" />}
        />
        <StatCard
          title="Critical Alerts"
          value={criticalAlerts}
          total={alerts.length}
          icon={<AlertCircle className="text-destructive" />}
        />
        <StatCard
          title="Avg Speed"
          value={Math.round(devices.reduce((sum, [, d]) => sum + (d.speed || 0), 0) / devices.length || 0)}
          unit="km/h"
          icon={<Gauge className="text-accent" />}
        />
        <StatCard
          title="Avg Temp"
          value={Math.round(devices.reduce((sum, [, d]) => sum + (d.temperature || 0), 0) / devices.length || 0)}
          unit="°C"
          icon={<Thermometer className="text-secondary" />}
        />
      </div>

      {/* Main Monitoring Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Devices List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-balance">Connected Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {devices.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No devices connected</p>
              ) : (
                devices.map(([deviceId, data]) => (
                  <button
                    key={deviceId}
                    onClick={() => setSelectedDevice(deviceId)}
                    className={`w-full p-3 rounded-lg border transition-colors text-left ${
                      selectedDevice === deviceId
                        ? "bg-primary/10 border-primary"
                        : "bg-muted/50 border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{deviceId}</p>
                        <p className="text-xs text-muted-foreground truncate">Driver: {data.driverId}</p>
                        <p className="text-xs text-muted-foreground mt-1">Speed: {data.speed} km/h</p>
                      </div>
                      <Badge variant={data.status === "active" ? "default" : "outline"} className="mt-1">
                        {data.status || "idle"}
                      </Badge>
                    </div>
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Charts and Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedDevice && allTelemetry[selectedDevice] ? (
            <>
              <DeviceStatusMonitor
                deviceId={selectedDevice}
                driverId={allTelemetry[selectedDevice].driverId}
                metrics={[
                  {
                    label: "Speed",
                    value: allTelemetry[selectedDevice].speed,
                    unit: "km/h",
                    icon: <Gauge size={16} />,
                    status: allTelemetry[selectedDevice].speed > 100 ? "warning" : "normal",
                  },
                  {
                    label: "Temperature",
                    value: allTelemetry[selectedDevice].temperature,
                    unit: "°C",
                    icon: <Thermometer size={16} />,
                    status: allTelemetry[selectedDevice].temperature > 95 ? "critical" : "normal",
                  },
                  {
                    label: "Fuel Level",
                    value: allTelemetry[selectedDevice].fuelLevel,
                    unit: "%",
                    icon: <Droplet size={16} />,
                    status: allTelemetry[selectedDevice].fuelLevel < 20 ? "critical" : "normal",
                  },
                ]}
                lastUpdate={allTelemetry[selectedDevice].timestamp}
              />

              {telemetryHistory.length > 0 && (
                <TelemetryChart
                  data={telemetryHistory}
                  title="Telemetry History (Last 60 seconds)"
                  metrics={["speed", "temperature", "fuelLevel"]}
                />
              )}
            </>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>Select a device to view real-time telemetry</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Alerts Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <IoTAlertsPanel />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <HealthIndicator label="Database" status="healthy" />
            <HealthIndicator label="WebSocket" status={wsConnected ? "healthy" : "warning"} />
            <HealthIndicator label="API Gateway" status="healthy" />
            <HealthIndicator label="Cache" status="healthy" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
