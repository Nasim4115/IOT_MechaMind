"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Share2 } from 'lucide-react'

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [reportMetrics, setReportMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const reportTypes = [
    {
      id: "daily",
      title: "Daily Summary",
      description: "Today's complete performance metrics",
      icon: "📊",
      color: "text-blue-500",
    },
    {
      id: "weekly",
      title: "Weekly Analytics",
      description: "7-day comprehensive insights",
      icon: "📈",
      color: "text-green-500",
    },
    {
      id: "monthly",
      title: "Monthly Report",
      description: "Full month performance analysis",
      icon: "📉",
      color: "text-purple-500",
    },
    {
      id: "driver",
      title: "Driver Performance",
      description: "Individual and team metrics",
      icon: "🚗",
      color: "text-yellow-500",
    },
    {
      id: "financial",
      title: "Financial Report",
      description: "Revenue and expense breakdown",
      icon: "💰",
      color: "text-red-500",
    },
    {
      id: "custom",
      title: "Custom Report",
      description: "Create custom filters and metrics",
      icon: "⚙️",
      color: "text-indigo-500",
    },
  ]

  const generateReport = async (type: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/reports/generate?type=${type}`)
      if (response.ok) {
        const data = await response.json()
        setReportMetrics(data)
      } else {
        setReportMetrics({ totalRides: 0, revenue: 0, avgRating: 0, users: 0 })
      }
    } catch (error) {
      console.error("Error generating report:", error)
      setReportMetrics({ totalRides: 0, revenue: 0, avgRating: 0, users: 0 })
    } finally {
      setLoading(false)
    }
  }

  const recentReports: any[] = []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1">Generate and manage performance reports</p>
      </div>

      {/* Report Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((report) => (
          <Card
            key={report.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              setSelectedReport(report.id)
              generateReport(report.title)
            }}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="text-4xl">{report.icon}</div>
                <div>
                  <h3 className="font-semibold">{report.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{report.description}</p>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent" disabled={loading}>
                  {loading ? "Generating..." : "Generate"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Details */}
      {selectedReport && reportMetrics && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{reportTypes.find((r) => r.id === selectedReport)?.title} Report</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2 bg-transparent" size="sm">
                  <Download size={16} /> Export PDF
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent" size="sm">
                  <Share2 size={16} /> Share
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricBox label="Total Rides" value={reportMetrics.totalRides || "0"} />
                <MetricBox label="Revenue" value={`$${reportMetrics.revenue || "0"}`} />
                <MetricBox label="Avg Rating" value={reportMetrics.avgRating || "0★"} />
                <MetricBox label="Users" value={reportMetrics.users || "0"} />
              </div>
              <p className="text-sm text-muted-foreground">Report generated on {new Date().toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Reports */}
      {recentReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReports.map((report, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-accent" />
                    <div>
                      <p className="font-medium text-sm">{report.name}</p>
                      <p className="text-xs text-muted-foreground">{report.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{report.size}</span>
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {recentReports.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center py-4">No recent reports available</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-muted rounded-lg">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  )
}
