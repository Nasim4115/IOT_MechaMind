"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Bell, User, DollarSign, TrendingUp, Award, CheckCircle, Clock, Navigation, LogOut, Settings } from 'lucide-react'
import { useRealtimeDrivers } from "@/hooks/use-realtime-drivers"

export default function DriversPage() {
  const { drivers, loading, error } = useRealtimeDrivers()
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "request",
      title: "New Ride Request",
      message: "Downtown to Airport - $35.50 • 25 km",
      time: "5 minutes ago",
      read: false,
    },
    {
      id: 2,
      type: "earning",
      title: "Bonus Earned",
      message: "You earned $50 bonus for 50 rides completed!",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 3,
      type: "alert",
      title: "Maintenance Reminder",
      message: "Vehicle inspection due in 7 days",
      time: "1 day ago",
      read: true,
    },
  ])

  const driverProfile = drivers.length > 0 ? drivers[0] : null

  const activeRideRequests = [
    {
      id: 1,
      pickup: "Central Station",
      dropoff: "Airport Terminal 2",
      distance: "25 km",
      estimatedFare: "$35.50",
      passenger: "Sarah M.",
      rating: 4.8,
      time: "Just now",
      status: "waiting",
    },
    {
      id: 2,
      pickup: "Downtown Mall",
      dropoff: "Business District",
      distance: "8.5 km",
      estimatedFare: "$12.50",
      passenger: "Alex J.",
      rating: 4.6,
      time: "2 minutes ago",
      status: "waiting",
    },
  ]

  const rideHistory = [
    {
      id: 1,
      date: "2024-11-10",
      time: "14:30",
      passenger: "Emma Wilson",
      destination: "Downtown Mall",
      distance: "8.5 km",
      fare: "$12.50",
      status: "completed",
    },
    {
      id: 2,
      date: "2024-11-10",
      time: "12:15",
      passenger: "Michael Brown",
      destination: "Airport",
      distance: "32 km",
      fare: "$45.00",
      status: "completed",
    },
    {
      id: 3,
      date: "2024-11-09",
      time: "18:45",
      passenger: "Jessica Lee",
      destination: "Central Station",
      distance: "5.2 km",
      fare: "$8.75",
      status: "completed",
    },
  ]

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleDeleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const handleAcceptRide = (id: number) => {
    console.log("Ride accepted:", id)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading driver data...</p>
      </div>
    )
  }

  if (!driverProfile) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Driver Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage rides, earnings, and account</p>
        </div>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground py-12">No driver profile found. Add a driver in your database to get started.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Driver Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage rides, earnings, and account</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold mt-1">${driverProfile.totalEarnings || 0}</p>
              </div>
              <DollarSign className="text-green-500" size={32} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold mt-1">${driverProfile.monthlyEarnings || 0}</p>
              </div>
              <TrendingUp className="text-blue-500" size={32} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Rides</p>
                <p className="text-2xl font-bold mt-1">{driverProfile.totalRides || 0}</p>
              </div>
              <Navigation className="text-blue-400" size={32} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="text-2xl font-bold mt-1">⭐ {driverProfile.rating || "N/A"}</p>
              </div>
              <Award className="text-yellow-500" size={32} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Points</p>
                <p className="text-2xl font-bold mt-1">{driverProfile.points || 0}</p>
              </div>
              <Award className="text-purple-500" size={32} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Profile & Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Driver Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={20} />
                Driver Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-semibold">{driverProfile.name || "Unknown"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-semibold text-sm">{driverProfile.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="font-semibold">{driverProfile.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">License #</p>
                <p className="font-semibold text-sm">{driverProfile.licenseNumber || "N/A"}</p>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">Vehicle</p>
                <p className="font-semibold">{driverProfile.vehicle || "N/A"}</p>
                <p className="text-xs text-muted-foreground">{driverProfile.vehicleNumber || "N/A"}</p>
              </div>
              <Button className="w-full mt-4 bg-transparent" variant="outline">
                <Settings size={16} className="mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Earnings & Points */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign size={20} />
                Earnings & Points
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-lg">
                <p className="text-sm font-medium">Total Earnings</p>
                <p className="text-3xl font-bold mt-1">${driverProfile.totalEarnings || 0}</p>
                <p className="text-xs mt-2 opacity-90">Lifetime earnings</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4 rounded-lg">
                <p className="text-sm font-medium">Reward Points</p>
                <p className="text-3xl font-bold mt-1">{driverProfile.points || 0}</p>
                <p className="text-xs mt-2 opacity-90">Redeem for vehicle upgrades</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm pb-2 border-b">
                  <span>Completion Rate</span>
                  <span className="font-semibold text-green-600">{driverProfile.completionRate || 0}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Member Since</span>
                  <span className="font-semibold">{driverProfile.joinDate || "N/A"}</span>
                </div>
              </div>
              <Button className="w-full mt-4">Redeem Points</Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Navigation size={16} className="mr-2" />
                Start Ride
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <MapPin size={16} className="mr-2" />
                View Analytics
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Award size={16} className="mr-2" />
                View Achievements
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <LogOut size={16} className="mr-2" />
                Go Offline
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Content - Rides & Notifications */}
        <div className="lg:col-span-3 space-y-6">
          {/* Ride Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin size={20} />
                Ride Requests ({activeRideRequests.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeRideRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No active ride requests</p>
              ) : (
                <div className="space-y-3">
                  {activeRideRequests.map((request) => (
                    <div key={request.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin size={16} className="text-blue-500" />
                            <span className="font-semibold">{request.pickup}</span>
                            <span className="text-muted-foreground">→</span>
                            <span className="font-semibold">{request.dropoff}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {request.distance} • {request.estimatedFare}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{request.time}</p>
                          <p className="text-lg font-bold text-green-600">{request.estimatedFare}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-2">
                          <User size={16} />
                          <span className="text-sm">{request.passenger}</span>
                          <span className="text-sm text-yellow-500">⭐ {request.rating}</span>
                        </div>
                        <Button size="sm" onClick={() => handleAcceptRide(request.id)}>
                          <CheckCircle size={16} className="mr-1" />
                          Accept Ride
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ride Status Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock size={20} />
                Ride Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                  <CheckCircle className="text-green-600" size={24} />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Online & Ready</p>
                    <p className="text-xs text-muted-foreground">Accepting ride requests</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="text-center p-3 rounded-lg bg-muted">
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground">In Progress</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted">
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-xs text-muted-foreground">Today's Rides</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted">
                    <p className="text-2xl font-bold">2h 15m</p>
                    <p className="text-xs text-muted-foreground">Online Time</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell size={20} />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No notifications</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border transition-all ${
                      notification.read
                        ? "bg-muted/50 border-muted"
                        : "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{notification.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <Clock size={12} />
                          {notification.time}
                        </p>
                      </div>
                      <div className="flex gap-1 ml-2">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-xs px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                          >
                            Mark
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="text-xs px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Ride History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Rides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr className="text-muted-foreground">
                      <th className="text-left py-2 px-3 font-semibold">Date/Time</th>
                      <th className="text-left py-2 px-3 font-semibold">Passenger</th>
                      <th className="text-left py-2 px-3 font-semibold">Destination</th>
                      <th className="text-left py-2 px-3 font-semibold">Distance</th>
                      <th className="text-left py-2 px-3 font-semibold">Fare</th>
                      <th className="text-left py-2 px-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rideHistory.map((ride) => (
                      <tr key={ride.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-2 px-3 text-sm">
                          {ride.date} {ride.time}
                        </td>
                        <td className="py-2 px-3 font-medium">{ride.passenger}</td>
                        <td className="py-2 px-3">{ride.destination}</td>
                        <td className="py-2 px-3">{ride.distance}</td>
                        <td className="py-2 px-3 font-semibold text-green-600">${ride.fare.replace("$", "")}</td>
                        <td className="py-2 px-3">
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            Completed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
