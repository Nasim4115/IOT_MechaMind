"use client"

import type React from "react"
import { FileText } from 'lucide-react'

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, LogOut, Activity, Users, TrendingUp, MapPin } from 'lucide-react'
import { auth, isConfigured } from "@/lib/firebase"
import { signOut } from "firebase/auth"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const authData = localStorage.getItem("admin_auth")
    if (!authData) {
      router.push("/login")
    } else {
      setAuthenticated(true)
    }
  }, [router])

  const handleLogout = async () => {
    try {
      if (isConfigured && auth) {
        await signOut(auth)
      }
    } catch (error) {
      console.error("[v0] Logout error:", error)
    } finally {
      localStorage.removeItem("admin_auth")
      router.push("/login")
    }
  }

  if (!authenticated) return null

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col border-r border-sidebar-border`}
      >
        <div className="p-4 flex items-center justify-between h-16 border-b border-sidebar-border">
          {sidebarOpen && <h1 className="font-bold text-lg">RideShare</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-sidebar-accent rounded">
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <NavLink href="/dashboard" icon={<Activity size={20} />} label="Dashboard" open={sidebarOpen} />
          {/* Remove My Profile link and keep Users link */}
          <NavLink href="/dashboard/rides" icon={<MapPin size={20} />} label="Rides" open={sidebarOpen} />
          <NavLink href="/dashboard/users" icon={<Users size={20} />} label="Users" open={sidebarOpen} />
          <NavLink href="/dashboard/drivers" icon={<Users size={20} />} label="Drivers" open={sidebarOpen} />
          <NavLink href="/dashboard/analytics" icon={<TrendingUp size={20} />} label="Analytics" open={sidebarOpen} />
          <NavLink href="/dashboard/iot" icon={<MapPin size={20} />} label="IoT" open={sidebarOpen} />
          <NavLink href="/dashboard/monitoring" icon={<Activity size={20} />} label="Monitoring" open={sidebarOpen} />
          <NavLink href="/dashboard/reports" icon={<FileText size={20} />} label="Reports" open={sidebarOpen} />
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleLogout}>
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center px-6 shadow-sm">
          <h2 className="text-xl font-semibold">RideShare Admin Dashboard</h2>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}

function NavLink({ href, icon, label, open }: { href: string; icon: React.ReactNode; label: string; open: boolean }) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors">
        {icon}
        {open && <span className="text-sm">{label}</span>}
      </div>
    </Link>
  )
}
