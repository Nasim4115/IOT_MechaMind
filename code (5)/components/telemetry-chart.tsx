"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TelemetryChartProps {
  data: Array<{
    timestamp: number
    speed: number
    temperature: number
    fuelLevel: number
    rpms: number
    acceleration: number
  }>
  title: string
  metrics: string[]
}

export function TelemetryChart({ data, title, metrics }: TelemetryChartProps) {
  const formattedData = data.map((d) => ({
    ...d,
    time: new Date(d.timestamp).toLocaleTimeString(),
  }))

  const colors: Record<string, string> = {
    speed: "var(--primary)",
    temperature: "var(--accent)",
    fuelLevel: "var(--secondary)",
    rpms: "#ef4444",
    acceleration: "#8b5cf6",
  }

  const stats = metrics.map((metric) => {
    const values = data.map((d) => d[metric as keyof typeof d] as number)
    return {
      metric,
      avg: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1),
      max: Math.max(...values).toFixed(1),
      min: Math.min(...values).toFixed(1),
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-balance">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
              }}
            />
            <Legend />
            {metrics.map((metric) => (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                stroke={colors[metric] || "var(--primary)"}
                dot={false}
                strokeWidth={2}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-6 grid grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.metric} className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs font-medium text-muted-foreground capitalize">{stat.metric}</p>
              <div className="flex gap-3 mt-2 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground">Min:</span>
                  <p className="font-semibold">{stat.min}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Avg:</span>
                  <p className="font-semibold">{stat.avg}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Max:</span>
                  <p className="font-semibold">{stat.max}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
