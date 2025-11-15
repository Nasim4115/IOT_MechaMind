import { Card, CardContent } from "@/components/ui/card"

export function StatCard({ title, value, total, unit, icon }: any) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">
              {value}
              {unit && <span className="text-lg text-muted-foreground ml-1">{unit}</span>}
            </p>
            {total !== undefined && <p className="text-xs text-muted-foreground mt-1">of {total} total</p>}
          </div>
          <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

export function HealthIndicator({ label, status }: { label: string; status: "healthy" | "warning" | "critical" }) {
  const statusColors = {
    healthy: "bg-green-500/20 text-green-700",
    warning: "bg-yellow-500/20 text-yellow-700",
    critical: "bg-destructive/20 text-destructive",
  }

  return (
    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
      <span className="text-sm font-medium">{label}</span>
      <div className={`px-2 py-1 rounded text-xs font-medium ${statusColors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    </div>
  )
}
