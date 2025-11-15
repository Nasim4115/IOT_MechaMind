"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DeviceMetric {
  label: string
  value: string | number
  unit?: string
  status?: "normal" | "warning" | "critical"
  icon?: React.ReactNode
}

interface DeviceStatusMonitorProps {
  deviceId: string
  driverId: string
  metrics: DeviceMetric[]
  lastUpdate: number
}

export function DeviceStatusMonitor({ deviceId, driverId, metrics, lastUpdate }: DeviceStatusMonitorProps) {
  const isStale = Date.now() - lastUpdate > 10000

  const healthScore =
    metrics.length > 0
      ? ((metrics.filter((m) => m.status === "normal").length / metrics.length) * 100).toFixed(0)
      : "N/A"

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "critical":
        return "bg-destructive/20 text-destructive border-destructive"
      case "warning":
        return "bg-yellow-500/20 text-yellow-700 border-yellow-500"
      default:
        return "bg-green-500/20 text-green-700 border-green-500"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-balance">Device Status</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Device: {deviceId}</p>
            <p className="text-xs text-muted-foreground">Driver: {driverId}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-2">
              <span className="text-2xl font-bold">{healthScore}%</span>
              <Badge variant={isStale ? "destructive" : "outline"}>{isStale ? "Offline" : "Online"}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Health Score</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {metrics.map((metric, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                {metric.icon && metric.icon}
                <span className="text-sm font-medium">{metric.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`font-bold ${metric.status === "critical" ? "text-destructive" : metric.status === "warning" ? "text-yellow-600" : "text-green-600"}`}
                >
                  {metric.value}
                </span>
                {metric.unit && <span className="text-xs text-muted-foreground">{metric.unit}</span>}
              </div>
            </div>
          ))}
          <div className="text-xs text-muted-foreground mt-4 pt-3 border-t border-border">
            Last update: {new Date(lastUpdate).toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
