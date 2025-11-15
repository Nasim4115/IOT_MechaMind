"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, Bell, User, MapPin, Clock, TrendingUp, Award, Settings } from 'lucide-react'

export default function ProfilePage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)
  const [recentRides, setRecentRides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        // Fetch user profile
        const userResponse = await fetch("/api/user/profile")
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUserProfile(userData)
        } else {
          setUserProfile({
            name: "User",
            email: "user@example.com",
            phone: "+1 (555) 000-0000",
            joinDate: "N/A",
            totalRides: 0,
            totalPoints: 0,
            pointsThisMonth: 0,
            rating: 0,
            memberTier: "Standard",
          })
        }

        // Fetch recent rides
        const ridesResponse = await fetch("/api/user/rides")
        if (ridesResponse.ok) {
          const ridesData = await ridesResponse.json()
          setRecentRides(ridesData || [])
        }

        // Fetch notifications
        const notifResponse = await fetch("/api/user/notifications")
        if (notifResponse.ok) {
          const notifData = await notifResponse.json()
          setNotifications(notifData || [])
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        setUserProfile({
          name: "User",
          email: "user@example.com",
          phone: "+1 (555) 000-0000",
          joinDate: "N/A",
          totalRides: 0,
          totalPoints: 0,
          pointsThisMonth: 0,
          rating: 0,
          memberTier: "Standard",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleDeleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account and rewards</p>
      </div>

      {/* Quick Stats */}
      {userProfile ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                  <p className="text-2xl font-bold mt-1">{userProfile.totalPoints || 0}</p>
                </div>
                <Award className="text-yellow-500" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold mt-1">+{userProfile.pointsThisMonth || 0}</p>
                </div>
                <TrendingUp className="text-green-500" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Rides</p>
                  <p className="text-2xl font-bold mt-1">{userProfile.totalRides || 0}</p>
                </div>
                <MapPin className="text-blue-500" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="text-2xl font-bold mt-1">⭐ {userProfile.rating || 0}</p>
                </div>
                <Award className="text-purple-500" size={32} />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          {userProfile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User size={20} />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-semibold">{userProfile.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-semibold text-sm">{userProfile.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-semibold">{userProfile.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Member Since</p>
                  <p className="font-semibold">{userProfile.joinDate || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tier</p>
                  <p className="font-semibold text-amber-600">{userProfile.memberTier || "N/A"}</p>
                </div>
                <Button className="w-full mt-4 bg-transparent" variant="outline">
                  <Settings size={16} className="mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Rewards Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift size={20} />
                Rewards & Redeem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-lg">
                <p className="text-sm font-medium">Available Points</p>
                <p className="text-3xl font-bold mt-1">{userProfile?.totalPoints || 0}</p>
                <p className="text-xs mt-2 opacity-90">Earn more points with every ride!</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm">$5 Discount</span>
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">250 pts</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm">$15 Discount</span>
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">750 pts</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm">Free Ride</span>
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">1500 pts</span>
                </div>
              </div>
              <Button className="w-full mt-4">Redeem Points</Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
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

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button className="h-24 flex-col items-center justify-center bg-transparent" variant="outline">
                  <MapPin size={24} className="mb-2" />
                  <span className="text-xs">Book Ride</span>
                </Button>
                <Button className="h-24 flex-col items-center justify-center bg-transparent" variant="outline">
                  <Gift size={24} className="mb-2" />
                  <span className="text-xs">Redeem Offer</span>
                </Button>
                <Button className="h-24 flex-col items-center justify-center bg-transparent" variant="outline">
                  <TrendingUp size={24} className="mb-2" />
                  <span className="text-xs">View History</span>
                </Button>
                <Button className="h-24 flex-col items-center justify-center bg-transparent" variant="outline">
                  <Settings size={24} className="mb-2" />
                  <span className="text-xs">Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Ride Overview */}
          {recentRides.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Rides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border">
                      <tr className="text-muted-foreground">
                        <th className="text-left py-2 px-3 font-semibold">Date</th>
                        <th className="text-left py-2 px-3 font-semibold">Destination</th>
                        <th className="text-left py-2 px-3 font-semibold">Driver</th>
                        <th className="text-left py-2 px-3 font-semibold">Distance</th>
                        <th className="text-left py-2 px-3 font-semibold">Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentRides.map((ride) => (
                        <tr key={ride.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="py-2 px-3 text-sm">{ride.date}</td>
                          <td className="py-2 px-3 font-medium">{ride.destination}</td>
                          <td className="py-2 px-3">{ride.driver}</td>
                          <td className="py-2 px-3">{ride.distance}</td>
                          <td className="py-2 px-3 font-semibold">{ride.cost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {recentRides.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground text-center py-4">No recent rides</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
