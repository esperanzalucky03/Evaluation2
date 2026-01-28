"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Users, FileText, Settings, LogOut, TrendingUp, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const router = useRouter()
  const [adminUsername, setAdminUsername] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    const username = localStorage.getItem("adminUsername")

    if (role !== "admin") {
      router.push("/login")
      return
    }

    setAdminUsername(username || "")
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("adminUsername")
    localStorage.removeItem("sessionId")
    router.push("/login")
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Sidebar Navigation */}
      <div className="flex gap-6 h-screen">
        <div className="w-64 bg-slate-900 border-r border-slate-800 p-6 overflow-y-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-6 h-6 text-emerald-400" />
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            </div>
            <p className="text-sm text-slate-400">Evaluation Management System</p>
          </div>

          <div className="space-y-1 mb-8">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">System</p>
            <Link href="/admin/evaluations">
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-200 hover:bg-slate-800 hover:text-emerald-400"
              >
                <FileText className="w-4 h-4 mr-3" />
                Evaluations
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-200 hover:bg-slate-800 hover:text-emerald-400"
              >
                <BarChart3 className="w-4 h-4 mr-3" />
                Analytics & Reports
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-200 hover:bg-slate-800 hover:text-emerald-400"
              >
                <Users className="w-4 h-4 mr-3" />
                User Management
              </Button>
            </Link>
            <Link href="/admin/account-settings">
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-200 hover:bg-slate-800 hover:text-emerald-400"
              >
                <Settings className="w-4 h-4 mr-3" />
                Account Settings
              </Button>
            </Link>
          </div>

          <div className="pt-6 border-t border-slate-800">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-red-400 hover:bg-slate-800 hover:text-red-300"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Top Bar */}
          <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-10">
            <div className="px-8 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
                <p className="text-sm text-slate-400 mt-1">Welcome back, {adminUsername}</p>
              </div>
              <div className="text-sm text-slate-400">Evaluation Period: Jan 1 - Jan 31, 2026</div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-300">Total Evaluations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-400">47</div>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    15% from last period
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-300">Students Participated</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-400">182</div>
                  <p className="text-xs text-slate-400 mt-1">Out of 250 total students</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-300">Avg. Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-400">4.3</div>
                  <p className="text-xs text-slate-400 mt-1">Out of 5.0</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800 border-orange-500/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-400" />
                    Pending Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-400">12</div>
                  <p className="text-xs text-slate-400 mt-1">Require action</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="bg-slate-900 border border-slate-800">
                <TabsTrigger value="overview" className="text-slate-300 data-[state=active]:text-emerald-400">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="teachers" className="text-slate-300 data-[state=active]:text-emerald-400">
                  Teachers
                </TabsTrigger>
                <TabsTrigger value="feedback" className="text-slate-300 data-[state=active]:text-emerald-400">
                  Feedback Summary
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Evaluation Status</CardTitle>
                    <CardDescription className="text-slate-400">
                      Real-time evaluation submission progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300">Detailed charts and graphs coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="teachers" className="space-y-4">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Teacher Ratings</CardTitle>
                    <CardDescription className="text-slate-400">Performance metrics by teacher</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300">Teacher performance data coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="feedback" className="space-y-4">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Student Feedback</CardTitle>
                    <CardDescription className="text-slate-400">
                      Common themes and insights from evaluations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300">Feedback analysis coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/admin/evaluations">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">View All Evaluations</Button>
              </Link>
              <Link href="/admin/analytics">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">View Analytics</Button>
              </Link>
              <Link href="/admin/settings">
                <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white">Manage Users</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
