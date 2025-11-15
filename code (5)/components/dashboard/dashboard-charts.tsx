'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface DashboardChartsProps {
  ridesPerHour?: any[]
  revenueTrend?: any[]
  rideTypes?: any[]
  waitTimes?: any[]
  topDestinations?: any[]
  COLORS: string[]
}

export function DashboardCharts({
  ridesPerHour,
  revenueTrend,
  rideTypes,
  waitTimes,
  topDestinations,
  COLORS,
}: DashboardChartsProps) {
  return (
    <div className="space-y-6">
      {/* Rides Per Hour Chart */}
      {ridesPerHour && ridesPerHour.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Total Rides Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ridesPerHour}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="time" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip />
                <Line type="monotone" dataKey="rides" stroke="var(--primary)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        {revenueTrend && revenueTrend.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Ride Types Distribution */}
        {rideTypes && rideTypes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Ride Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={rideTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {rideTypes.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Wait Times */}
        {waitTimes && waitTimes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Average Wait Times (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={waitTimes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="hour" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip />
                  <Bar dataKey="waitTime" fill="var(--secondary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Top Destinations */}
        {topDestinations && topDestinations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Top Destinations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topDestinations.map((dest: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{dest.location}</span>
                    <div className="flex items-center gap-2 flex-1 ml-4">
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: `${(dest.rides / 1000) * 100}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground font-semibold">{dest.rides}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
