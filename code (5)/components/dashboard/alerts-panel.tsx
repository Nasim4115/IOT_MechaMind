import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, TrendingDown, AlertTriangle } from "lucide-react"

export default function AlertsPanel({ alerts }: { alerts: any[] }) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="text-yellow-500" size={18} />
      case "error":
        return <AlertCircle className="text-destructive" size={18} />
      case "info":
        return <AlertCircle className="text-primary" size={18} />
      default:
        return <TrendingDown className="text-muted-foreground" size={18} />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.length > 0 ? (
            alerts.map((alert, index) => (
              <div key={index} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <p className="font-medium text-sm">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No alerts</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
