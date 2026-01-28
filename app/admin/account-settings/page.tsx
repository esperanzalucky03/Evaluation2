"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Eye, EyeOff, LogOut, Lock, Shield } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function AdminAccountSettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("account")
  const [adminName, setAdminName] = useState("Administrator")
  const [adminEmail, setAdminEmail] = useState("")
  const [adminPhone, setAdminPhone] = useState("")
  const [department, setDepartment] = useState("Academic Affairs")
  const [showPassword, setShowPassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [activityLogs, setActivityLogs] = useState<any[]>([])

  useEffect(() => {
    const savedAdminEmail = localStorage.getItem("adminEmail")
    const savedAdminName = localStorage.getItem("adminName")
    const savedAdminPhone = localStorage.getItem("adminPhone")
    const savedDepartment = localStorage.getItem("adminDepartment")
    const saved2FA = localStorage.getItem("twoFactorEnabled")

    if (savedAdminEmail) setAdminEmail(savedAdminEmail)
    if (savedAdminName) setAdminName(savedAdminName)
    if (savedAdminPhone) setAdminPhone(savedAdminPhone)
    if (savedDepartment) setDepartment(savedDepartment)
    if (saved2FA) setTwoFactorEnabled(JSON.parse(saved2FA))

    loadActivityLogs()
    setIsLoading(false)
  }, [])

  const loadActivityLogs = () => {
    const logs = Object.keys(localStorage)
      .filter((key) => key.startsWith("activity-log-"))
      .map((key) => {
        try {
          return JSON.parse(localStorage.getItem(key) || "")
        } catch {
          return null
        }
      })
      .filter((log) => log !== null)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
    setActivityLogs(logs)
  }

  const logActivity = (action: string) => {
    const log = {
      action,
      timestamp: new Date().toISOString(),
      admin: adminName,
    }
    localStorage.setItem(`activity-log-${Date.now()}`, JSON.stringify(log))
  }

  const handlePasswordChange = () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields")
      return
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    localStorage.setItem("adminPassword", newPassword)
    setNewPassword("")
    setConfirmPassword("")
    logActivity(`Changed password`)
    toast.success("Password changed successfully")
  }

  const handleLogout = () => {
    logActivity("Logged out")
    localStorage.removeItem("userRole")
    localStorage.removeItem("adminUsername")
    localStorage.removeItem("sessionId")
    toast.success("Logged out successfully")
    router.push("/login")
  }

  const saveAccountInfo = () => {
    localStorage.setItem("adminEmail", adminEmail)
    localStorage.setItem("adminName", adminName)
    localStorage.setItem("adminPhone", adminPhone)
    localStorage.setItem("adminDepartment", department)
    logActivity(`Updated account information`)
    toast.success("Account information saved")
  }

  if (isLoading) {
    return <div className="min-h-screen bg-purple-50 p-4 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard/admin" className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

        {/* Tabs Navigation */}
        <div className="flex gap-2 mb-6 border-b border-gray-300 flex-wrap">
          {["account", "personal", "security", "activity"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-all ${
                activeTab === tab
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab === "account" && "Account Info"}
              {tab === "personal" && "Personal Details"}
              {tab === "security" && "Security"}
              {tab === "activity" && "Activity Logs"}
            </button>
          ))}
        </div>

        <div className="grid gap-6">
          {/* Account Information Tab */}
          {activeTab === "account" && (
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Manage your admin account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="admin-name">Full Name</Label>
                  <Input
                    id="admin-name"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="admin-email">Email Address</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="mt-2"
                    placeholder="admin@school.com"
                  />
                </div>
                <Button onClick={saveAccountInfo} className="bg-purple-600 hover:bg-purple-700">
                  Save Account Info
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Personal Details Tab */}
          {activeTab === "personal" && (
            <Card>
              <CardHeader>
                <CardTitle>Personal Details</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="admin-phone">Phone Number</Label>
                  <Input
                    id="admin-phone"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    className="mt-2"
                    placeholder="+63 9XX XXX XXXX"
                  />
                </div>
                <div>
                  <Label htmlFor="admin-department">Department</Label>
                  <select
                    id="admin-department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option>Academic Affairs</option>
                    <option>Student Services</option>
                    <option>Administration</option>
                    <option>Human Resources</option>
                    <option>Finance</option>
                  </select>
                </div>
                <Button onClick={saveAccountInfo} className="bg-purple-600 hover:bg-purple-700">
                  Save Personal Details
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Security & Privacy Tab */}
          {activeTab === "security" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Password & Security</CardTitle>
                  <CardDescription>Manage your security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="mt-2"
                    />
                  </div>
                  <Button onClick={handlePasswordChange} className="bg-purple-600 hover:bg-purple-700">
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Two-Factor Authentication
                  </CardTitle>
                  <CardDescription>Add an extra layer of security to your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Status: {twoFactorEnabled ? "Enabled" : "Disabled"}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {twoFactorEnabled
                          ? "Your account is protected with 2FA"
                          : "Enable 2FA to secure your account"}
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setTwoFactorEnabled(!twoFactorEnabled)
                        localStorage.setItem("twoFactorEnabled", JSON.stringify(!twoFactorEnabled))
                        logActivity(`${!twoFactorEnabled ? "Enabled" : "Disabled"} 2FA`)
                        toast.success(`2FA ${!twoFactorEnabled ? "enabled" : "disabled"}`)
                      }}
                      className={twoFactorEnabled ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}
                    >
                      {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Activity Logs Tab */}
          {activeTab === "activity" && (
            <Card>
              <CardHeader>
                <CardTitle>Activity Logs</CardTitle>
                <CardDescription>Recent activity on your admin account</CardDescription>
              </CardHeader>
              <CardContent>
                {activityLogs.length === 0 ? (
                  <p className="text-sm text-gray-600">No activity logs yet</p>
                ) : (
                  <div className="space-y-3">
                    {activityLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{log.action}</p>
                          <p className="text-xs text-gray-600">
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <span className="text-xs font-semibold bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                          {log.admin}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Logout Button */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-900">Session Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700">
                <LogOut className="w-4 h-4 mr-2" />
                Logout from Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
