import { getRides } from "@/lib/firebase-queries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from 'lucide-react'

export default async function RidesPage() {
  const allRides = await getRides()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ride History</h1>
        <p className="text-muted-foreground mt-1">View and manage all rides</p>
      </div>

      {allRides.length === 0 && (
        <Card className="border border-amber-200 bg-amber-50 dark:bg-amber-950">
          <CardContent className="pt-6">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              No rides data available. Database is empty.
            </p>
          </CardContent>
        </Card>
      )}

      {allRides.length > 0 && (
        <>
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
                  <Input placeholder="Search by user, driver, or location..." className="pl-10" />
                </div>
                <select className="px-3 py-2 border border-input rounded-lg bg-background">
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Filter size={18} /> More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Rides Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Rides ({allRides.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr className="text-muted-foreground">
                      <th className="text-left py-3 px-4 font-semibold">User</th>
                      <th className="text-left py-3 px-4 font-semibold">Driver</th>
                      <th className="text-left py-3 px-4 font-semibold">Route</th>
                      <th className="text-left py-3 px-4 font-semibold">Fare</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allRides.map((ride: any) => (
                      <tr key={ride.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">{ride.user}</td>
                        <td className="py-3 px-4">{ride.driver}</td>
                        <td className="py-3 px-4 text-xs text-muted-foreground">
                          {ride.pickupLocation} → {ride.dropoffLocation}
                        </td>
                        <td className="py-3 px-4 font-semibold">${ride.fare}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={ride.status} />
                        </td>
                        <td className="py-3 px-4 text-xs text-muted-foreground">{ride.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: any = {
    completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  }
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[status] || "bg-gray-100 text-gray-800"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
