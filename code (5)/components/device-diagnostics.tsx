"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, TrendingUp, TrendingDown, Activity } from "lucide-react"

interface Diagnostic {
  id: string
  name: string
  status: "ok" | "warning" | "critical"
  value: string
  threshold?: string
  trend?: "up" | "down" | "stable"
}

interface DeviceDiagnosticsProps {
  deviceId: string
  diagnostics: Diagnostic[]
}

export function DeviceDiagnostics({ deviceId, diagnostics }: DeviceDiagnosticsProps) {
  const criticalCount = diagnostics.filter((d) => d.status === "critical").length
  const warningCount = diagnostics.filter((d) => d.status === "warning").length

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
        return <AlertCircle className="w-4 h-4 text-destructive" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      default:
        return <Activity className="w-4 h-4 text-green-600" />
    }
  }

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3" />
      case "down":
        return <TrendingDown className="w-3 h-3" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Device Diagnostics</CardTitle>
          <div className="flex gap-2">
            {criticalCount > 0 && <Badge variant="destructive">{criticalCount} Critical</Badge>}
            {warningCount > 0 && <Badge variant="secondary">{warningCount} Warning</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {diagnostics.map((diag) => (
            <div key={diag.id} className="p-3 border border-border rounded-lg hover:bg-accent/50 transition">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getStatusIcon(diag.status)}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{diag.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{diag.value}</p>
                    {diag.threshold && <p className="text-xs text-muted-foreground">Threshold: {diag.threshold}</p>}
                  </div>
                </div>
                {diag.trend && <div className="text-muted-foreground">{getTrendIcon(diag.trend)}</div>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
