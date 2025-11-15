"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, TrendingUp } from 'lucide-react'
import { IoTCharts } from "@/components/charts/iot-charts"
import { useRealtimeDrivers } from "@/hooks/use-realtime-drivers"

interface AnalyticsData {
  date: string
  avgSpeed: number
  maxSpeed: number
  totalDistance: number
  fuelConsumption: number
  hardBrakes: number
  harshAccelerations: number
  idleTime: number
  drivingTime: number
}

interface DeviceReport {
  deviceId: string
  driverId: string
  totalTrips: number
  totalDistance: number
  avgSpeed: number
  fuelEfficiency: number
  safetyScore: number
  maintenanceAlerts: number
}

export default function IoTReportsPage() {
  const [dateRange, setDateRange] = useState<"week" | "month" | "year">("week")
  const { drivers, loading } = useRealtimeDrivers()

  const deviceReports: DeviceReport[] = drivers.map((driver, index) => ({
    deviceId: `GPS-${String(index + 1).padStart(3, '0')}`,
    driverId: driver.id || `DRV-${String(index + 1).padStart(3, '0')}`,
    totalTrips: driver.totalRides || 0,
    totalDistance: driver.totalEarnings ? Math.floor(driver.totalEarnings / 2) : 0,
    avgSpeed: 45 + (index * 3),
    fuelEfficiency: 8.5 - (index * 0.3),
    safetyScore: 90 + (index * 2),
    maintenanceAlerts: index % 2,
  }))

  const analyticsData: AnalyticsData[] = [
    {
      date: "Mon",
      avgSpeed: 45,
      maxSpeed: 95,
      totalDistance: 245,
      fuelConsumption: 18.5,
      hardBrakes: 3,
      harshAccelerations: 2,
      idleTime: 15,
      drivingTime: 420,
    },
    {
      date: "Tue",
      avgSpeed: 48,
      maxSpeed: 102,
      totalDistance: 278,
      fuelConsumption: 21.2,
      hardBrakes: 5,
      harshAccelerations: 3,
      idleTime: 12,
      drivingTime: 455,
    },
    {
      date: "Wed",
      avgSpeed: 42,
      maxSpeed: 88,
      totalDistance: 212,
      fuelConsumption: 16.8,
      hardBrakes: 2,
      harshAccelerations: 1,
      idleTime: 22,
      drivingTime: 380,
    },
    {
      date: "Thu",
      avgSpeed: 50,
      maxSpeed: 105,
      totalDistance: 295,
      fuelConsumption: 22.5,
      hardBrakes: 6,
      harshAccelerations: 4,
      idleTime: 18,
      drivingTime: 475,
    },
    {
      date: "Fri",
      avgSpeed: 46,
      maxSpeed: 98,
      totalDistance: 260,
      fuelConsumption: 19.8,
      hardBrakes: 4,
      harshAccelerations: 2,
      idleTime: 20,
      drivingTime: 440,
    },
    {
      date: "Sat",
      avgSpeed: 44,
      maxSpeed: 92,
      totalDistance: 238,
      fuelConsumption: 17.9,
      hardBrakes: 3,
      harshAccelerations: 2,
      idleTime: 25,
      drivingTime: 400,
    },
    {
      date: "Sun",
      avgSpeed: 40,
      maxSpeed: 85,
      totalDistance: 198,
      fuelConsumption: 15.2,
      hardBrakes: 2,
      harshAccelerations: 1,
      idleTime: 28,
      drivingTime: 350,
    },
  ]

  const timeDistributionData = [
    { name: "Driving", value: 65, fill: "var(--primary)" },
    { name: "Idle", value: 25, fill: "var(--accent)" },
    { name: "Stopped", value: 10, fill: "var(--secondary)" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading IoT reports...</p>
      </div>
    )
  }

  if (deviceReports.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">IoT Analytics & Reports</h1>
            <p className="text-muted-foreground mt-2">Historical data analysis and performance metrics</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground py-12">No driver data available. Add drivers to view IoT reports.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">IoT Analytics & Reports</h1>
          <p className="text-muted-foreground mt-2">Historical data analysis and performance metrics</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition">
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="flex gap-2">
        {(["week", "month", "year"] as const).map((range) => (
          <button
            key={range}
            onClick={() => setDateRange(range)}
            className={`px-4 py-2 rounded-lg border transition ${
              dateRange === range
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border hover:border-primary"
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard label="Avg Speed" value="45.7 km/h" change="+2.3%" />
        <MetricCard label="Total Distance" value="1,726 km" change="+5.1%" />
        <MetricCard label="Fuel Consumed" value="211.9 L" change="-1.2%" />
        <MetricCard label="Safety Score" value="91.3%" change="+3.5%" />
      </div>

      <IoTCharts analyticsData={analyticsData} timeDistributionData={timeDistributionData} />

      {/* Device Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Device Performance Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-semibold">Device ID</th>
                  <th className="text-left p-3 font-semibold">Driver</th>
                  <th className="text-center p-3 font-semibold">Trips</th>
                  <th className="text-center p-3 font-semibold">Distance (km)</th>
                  <th className="text-center p-3 font-semibold">Avg Speed</th>
                  <th className="text-center p-3 font-semibold">Fuel Eff.</th>
                  <th className="text-center p-3 font-semibold">Safety</th>
                  <th className="text-center p-3 font-semibold">Alerts</th>
                </tr>
              </thead>
              <tbody>
                {deviceReports.map((report) => (
                  <tr key={report.deviceId} className="border-b border-border hover:bg-muted/50 transition">
                    <td className="p-3 font-medium">{report.deviceId}</td>
                    <td className="p-3">{report.driverId}</td>
                    <td className="p-3 text-center">{report.totalTrips}</td>
                    <td className="p-3 text-center">{report.totalDistance}</td>
                    <td className="p-3 text-center">{report.avgSpeed} km/h</td>
                    <td className="p-3 text-center">{report.fuelEfficiency.toFixed(1)} L/100km</td>
                    <td className="p-3 text-center">
                      <Badge variant={report.safetyScore >= 90 ? "default" : "secondary"}>{report.safetyScore}%</Badge>
                    </td>
                    <td className="p-3 text-center">
                      {report.maintenanceAlerts > 0 ? (
                        <Badge variant="destructive">{report.maintenanceAlerts}</Badge>
                      ) : (
                        <Badge variant="outline">0</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({ label, value, change }: { label: string; value: string; change: string }) {
  const isPositive = change.startsWith("+")

  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold mt-2">{value}</p>
        <div className="flex items-center gap-1 mt-2">
          <TrendingUp size={16} className={isPositive ? "text-green-600" : "text-red-600"} />
          <span className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>{change}</span>
        </div>
      </CardContent>
    </Card>
  )
}
