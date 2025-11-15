import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Users, Car, Navigation, BarChart3, TrendingUp, MapPin, FileText } from 'lucide-react'
import { getDashboardMetrics, getRides, getDrivers, getAnalytics } from "@/lib/firebase-queries"
import AlertsPanel from "@/components/dashboard/alerts-panel"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"

export default async function DashboardPage() {
  const [metricsData, ridesData, driversData, analyticsData] = await Promise.all([
    getDashboardMetrics(),
    getRides(),
    getDrivers(),
    getAnalytics(),
  ])

  const isEmpty = !metricsData && ridesData.length === 0 && driversData.length === 0

  const metrics = metricsData || {
    activeUsers: 0,
    activeDrivers: 0,
    activeRides: 0,
    avgWaitTime: 0,
    ridesPerHour: [],
    revenueTrend: [],
    alerts: [],
  }

  const analytics = analyticsData || {
    topDestinations: [],
    rideTypes: [],
    waitTimes: [],
  }

  const COLORS = ["#3b82f6", "#f59e0b", "#ef4444", "#10b981", "#8b5cf6"]

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Real-time monitoring and analytics for your ride-sharing platform</p>
      </div>

      {isEmpty && (
        <Card className="border border-amber-200 bg-amber-50 dark:bg-amber-950">
          <CardContent className="pt-6">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              No data available. Database is empty. Send data to the API endpoints to see it reflected here.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Service Status Section */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="text-primary" />
            Service Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatusItem label="Platform" status="operational" />
            <StatusItem label="Payment Gateway" status="operational" />
            <StatusItem label="GPS Service" status="operational" />
            <StatusItem label="Notifications" status="operational" />
          </div>
        </CardContent>
      </Card>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Users"
          value={metrics.activeUsers || 0}
          icon={<Users className="text-primary" />}
          trend="+12%"
        />
        <MetricCard
          title="Active Drivers"
          value={metrics.activeDrivers || 0}
          icon={<Car className="text-accent" />}
          trend="+8%"
        />
        <MetricCard
          title="Active Rides"
          value={metrics.activeRides || 0}
          icon={<Navigation className="text-secondary" />}
          trend="+5%"
        />
        <MetricCard
          title="Avg Wait Time"
          value={`${metrics.avgWaitTime || 0}m`}
          icon={<AlertCircle className="text-destructive" />}
          trend="-3%"
        />
      </div>

      {/* Charts Section */}
      <DashboardCharts
        ridesPerHour={metrics.ridesPerHour}
        revenueTrend={metrics.revenueTrend}
        rideTypes={analytics.rideTypes}
        waitTimes={analytics.waitTimes}
        topDestinations={analytics.topDestinations}
        COLORS={COLORS}
      />

      {/* Driver Performance */}
      {driversData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-secondary" />
              Top Driver Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr className="text-muted-foreground">
                    <th className="text-left py-3 px-4 font-semibold">Driver Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Rating</th>
                    <th className="text-left py-3 px-4 font-semibold">Rides</th>
                    <th className="text-left py-3 px-4 font-semibold">Earnings</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {driversData
                    .sort((a, b) => Number.parseFloat(b.rating || 0) - Number.parseFloat(a.rating || 0))
                    .slice(0, 5)
                    .map((driver: any) => (
                      <tr key={driver.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 font-medium">{driver.name}</td>
                        <td className="py-3 px-4">⭐ {driver.rating || "N/A"}</td>
                        <td className="py-3 px-4">{driver.ridesCompleted || 0}</td>
                        <td className="py-3 px-4 font-semibold text-green-600">${driver.earnings || 0}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              driver.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {driver.status ? driver.status.charAt(0).toUpperCase() + driver.status.slice(1) : "N/A"}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Real-Time Tracking */}
      {ridesData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Real-Time Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ridesData
                    .filter((ride: any) => ride.status === "in-progress")
                    .slice(0, 5)
                    .map((ride: any) => (
                      <div key={ride.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {ride.user} → {ride.driver}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {ride.pickupLocation} to {ride.dropoffLocation}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-xs font-semibold text-green-600">In Transit</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts */}
          <div>
            <AlertsPanel alerts={metrics.alerts || []} />
          </div>
        </div>
      )}
    </div>
  )
}

function MetricCard({ title, value, icon, trend }: any) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p className="text-xs text-primary mt-2">{trend}</p>
          </div>
          <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatusItem({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${status === "operational" ? "bg-green-500" : "bg-red-500"}`} />
        <span className="text-xs font-semibold">{status === "operational" ? "Online" : "Offline"}</span>
      </div>
    </div>
  )
}
