"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, Zap, MapPin, Star, Bell, Settings, Calendar, TrendingUp, Edit2 } from 'lucide-react'
import { getUsers, getRides } from "@/lib/firebase-queries"

interface User {
  id: string
  name?: string
  email?: string
  ridesCompleted?: number
  rating?: number
  points?: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New reward: Earn 2x points this weekend!", type: "reward", read: false },
    { id: 2, message: "Your ride was completed successfully", type: "ride", read: false },
    { id: 3, message: "Driver rating received: 5 stars", type: "rating", read: true },
  ])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [usersData, ridesData] = await Promise.all([getUsers(), getRides()])
        setUsers(usersData)
        setRides(ridesData)
        if (usersData.length > 0) {
          setSelectedUser(usersData[0])
        }
      } catch (error) {
        console.error("[v0] Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading users...</div>
  }

  if (!selectedUser) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Users Dashboard</h1>
          <p className="text-muted-foreground mt-1">No users available</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No user data in database. Add users to Firebase to see them here.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const userRides = rides.filter((ride: any) => ride.userId === selectedUser.id).slice(0, 3)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users Dashboard</h1>
        <p className="text-muted-foreground mt-1">View user profiles, rewards, and activity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - User List */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-sm">Users</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {users.slice(0, 5).map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full text-left p-2 rounded hover:bg-muted transition-colors ${
                    selectedUser.id === user.id ? "bg-primary text-primary-foreground" : ""
                  }`}
                >
                  <p className="text-sm font-medium truncate">{user.name || "Unnamed"}</p>
                  <p className="text-xs text-muted-foreground">{user.email || "No email"}</p>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>{selectedUser.name || "Unnamed"}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{selectedUser.email || "No email"}</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Edit2 size={16} />
                Edit
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-semibold">+1 555-0123</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Member Since</p>
                  <p className="font-semibold">Jan 2024</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Rides</p>
                  <p className="font-semibold">{selectedUser.ridesCompleted || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <p className="font-semibold flex items-center gap-1">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    {selectedUser.rating || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats - Points & Earnings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Points</p>
                    <p className="text-2xl font-bold">{selectedUser.points || 0}</p>
                  </div>
                  <Zap className="text-yellow-500 opacity-70" size={32} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold">+{Math.floor((selectedUser.points || 0) * 0.3)}</p>
                  </div>
                  <TrendingUp className="text-green-500 opacity-70" size={32} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Redeemable</p>
                    <p className="text-2xl font-bold">${Math.floor((selectedUser.points || 0) / 100)}</p>
                  </div>
                  <Gift className="text-pink-500 opacity-70" size={32} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Points & Rewards Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift size={20} />
                Rewards & Redemptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">$5 Ride Credit</p>
                      <p className="text-xs text-muted-foreground">Requires 500 points</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Redeem
                    </Button>
                  </div>
                </div>
                <div className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">Free Premium Ride</p>
                      <p className="text-xs text-muted-foreground">Requires 1000 points</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Redeem
                    </Button>
                  </div>
                </div>
                <div className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">Priority Pickup</p>
                      <p className="text-xs text-muted-foreground">Requires 750 points</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Redeem
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="outline" className="flex flex-col h-auto py-4 gap-2 bg-transparent">
                  <MapPin size={20} />
                  <span className="text-xs">Book Ride</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-auto py-4 gap-2 bg-transparent">
                  <Gift size={20} />
                  <span className="text-xs">Redeem</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-auto py-4 gap-2 bg-transparent">
                  <Calendar size={20} />
                  <span className="text-xs">Ride History</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-auto py-4 gap-2 bg-transparent">
                  <Settings size={20} />
                  <span className="text-xs">Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Ride Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin size={20} />
                Recent Rides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userRides.map((ride) => (
                  <div
                    key={ride.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-sm">
                        {ride.from} → {ride.to}
                      </p>
                      <p className="text-xs text-muted-foreground">{ride.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${ride.fare}</p>
                      <p className="text-xs text-green-600">✓ Completed</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell size={20} />
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-lg border flex justify-between items-start ${
                    notif.read ? "bg-muted/30" : "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
                  }`}
                >
                  <div className="flex-1">
                    <p className={`text-sm ${notif.read ? "text-muted-foreground" : "font-semibold"}`}>
                      {notif.message}
                    </p>
                  </div>
                  {!notif.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="text-xs ml-2"
                    >
                      Mark read
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
