"use client"

import { useActiveAlerts } from "@/hooks/use-firebase-alerts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, AlertOctagon } from "lucide-react"

export function IoTAlertsPanel() {
  const { alerts, loading } = useActiveAlerts()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active IoT Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const criticalAlerts = alerts.filter((a) => a.severity === "high")
  const warningAlerts = alerts.filter((a) => a.severity === "medium")

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertOctagon className="w-4 h-4" />
      case "medium":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Active IoT Alerts</CardTitle>
        <Badge variant="outline">
          {criticalAlerts.length} Critical, {warningAlerts.length} Warning
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No active alerts. Devices running normally.</div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="p-3 border border-border rounded-lg bg-card hover:bg-accent/50 transition">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getSeverityIcon(alert.severity)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{alert.alertType}</span>
                      <Badge variant={getSeverityColor(alert.severity) as any}>{alert.severity}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                    <div className="text-xs text-muted-foreground mt-2">
                      Device: {alert.deviceId} | Driver: {alert.driverId}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
