"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Eye, EyeOff, Lock, Shield, LogOut } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function StudentAccountSettings() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("account")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [yearLevel, setYearLevel] = useState("1st Year")
  const [showPassword, setShowPassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [activityLogs, setActivityLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    if (role !== "student") {
      router.push("/login")
      return
    }

    const savedEmail = localStorage.getItem("userEmail")
    const savedName = localStorage.getItem("studentName")
    const savedPhone = localStorage.getItem("studentPhone")
    const savedYear = localStorage.getItem("studentYearLevel")
    const saved2FA = localStorage.getItem("student2FA")

    setEmail(savedEmail || "")
    setFullName(savedName || "Student User")
    setPhone(savedPhone || "")
    setYearLevel(savedYear || "1st Year")
    setTwoFactorEnabled(saved2FA ? JSON.parse(saved2FA) : false)

    loadActivityLogs()
    setIsLoading(false)
  }, [router])

  const loadActivityLogs = () => {
    const logs = Object.keys(localStorage)
      .filter((key) => key.startsWith("student-activity-"))
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
    }
    localStorage.setItem(`student-activity-${Date.now()}`, JSON.stringify(log))
  }

  const saveAccountInfo = () => {
    if (!fullName || !email) {
      toast.error("Please fill in required fields")
      return
    }
    localStorage.setItem("studentName", fullName)
    localStorage.setItem("studentPhone", phone)
    localStorage.setItem("studentYearLevel", yearLevel)
    logActivity("Updated account information")
    toast.success("Account information saved")
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
    localStorage.setItem("studentPassword", newPassword)
    setNewPassword("")
    setConfirmPassword("")
    logActivity("Changed password")
    toast.success("Password changed successfully")
  }

  const handleLogout = () => {
    logActivity("Logged out")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("sessionId")
    toast.success("Logged out successfully")
    router.push("/login")
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard/student" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

        {/* Tabs Navigation */}
        <div className="flex gap-2 mb-6 border-b border-gray-300 flex-wrap">
          {["account", "security", "activity"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-all ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab === "account" && "Account Info"}
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
                <CardDescription>Manage your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={email} disabled className="mt-2 bg-gray-100" />
                  <p className="text-xs text-gray-500 mt-1">Your email cannot be changed</p>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-2"
                    placeholder="+63 9XX XXX XXXX"
                  />
                </div>
                <div>
                  <Label htmlFor="year-level">Year Level</Label>
                  <select
                    id="year-level"
                    value={yearLevel}
                    onChange={(e) => setYearLevel(e.target.value)}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                  </select>
                </div>
                <Button onClick={saveAccountInfo} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Password & Security</CardTitle>
                  <CardDescription>Manage your password settings</CardDescription>
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
                  <Button onClick={handlePasswordChange} className="bg-blue-600 hover:bg-blue-700 text-white">
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
                        localStorage.setItem("student2FA", JSON.stringify(!twoFactorEnabled))
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
                <CardDescription>Recent activity on your account</CardDescription>
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
              <Button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white">
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
