"use client"

import { useRouter } from "next/navigation"
import { Eye, EyeOff, Shield, Lock, LogOut, ArrowLeft, Check, X, Edit2 } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { toast } from "sonner"

const defaultTeachers = [
  { id: 1, name: "Ms. Bernadette Carlos" },
  { id: 2, name: "Ms. Daisy Antonio" },
  { id: 3, name: "Ms. Irish Decelo" },
  { id: 4, name: "Mr. John David Demetrial" },
  { id: 5, name: "Mr. Ramos Florenz" },
  { id: 6, name: "Mr. Rogelio Galangue" },
  { id: 7, name: "Mr. Francis Polo" },
  { id: 8, name: "Mr. Ronaldo Tolentino" },
  { id: 9, name: "Ms. Margielyn Goc-Ong" },
  { id: 10, name: "Ms. Rosalyn Pandoro" },
]

export default function AdminSettingsPage() {
  const [teachers, setTeachers] = useState(defaultTeachers)
  const [newTeacher, setNewTeacher] = useState("")
  const [semestralPeriod, setSemestralPeriod] = useState("1st Semestral")
  const [yearLevel, setYearLevel] = useState("1st Year")
  const [evaluationPeriod, setEvaluationPeriod] = useState("Spring 2024")
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [adminEmail, setAdminEmail] = useState("")
  const [adminName, setAdminName] = useState("")
  const [adminPhone, setAdminPhone] = useState("")
  const [department, setDepartment] = useState("")
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [activityLogs, setActivityLogs] = useState([])
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("evaluation")
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem("teachers")
    const savedSemestral = localStorage.getItem("semestralPeriod")
    const savedYear = localStorage.getItem("yearLevel")
    const savedPeriod = localStorage.getItem("evaluationPeriod")

    if (saved) setTeachers(JSON.parse(saved))
    if (savedSemestral) setSemestralPeriod(savedSemestral)
    if (savedYear) setYearLevel(savedYear)
    if (savedPeriod) setEvaluationPeriod(savedPeriod)
    setIsLoading(false)
  }, [])

  const semestralOptions = ["1st Semestral", "2nd Semestral", "3rd Semestral", "4th Semestral"]
  const yearLevelOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"]

  const handleAddTeacher = () => {
    if (newTeacher.trim()) {
      const newId = Math.max(...teachers.map((t) => t.id), 0) + 1
      setTeachers([...teachers, { id: newId, name: newTeacher }])
      setNewTeacher("")
      toast.success("Teacher added successfully")
    }
  }

  const handleDeleteTeacher = (id: number) => {
    setTeachers(teachers.filter((t) => t.id !== id))
    toast.success("Teacher removed")
  }

  const handleSaveSettings = () => {
    localStorage.setItem("semestralPeriod", semestralPeriod)
    localStorage.setItem("yearLevel", yearLevel)
    localStorage.setItem("teachers", JSON.stringify(teachers))
    toast.success("Settings saved successfully")
  }

  const handleResetToDefaults = () => {
    setTeachers(defaultTeachers)
    setSemestralPeriod("1st Semestral")
    setYearLevel("1st Year")
    localStorage.setItem("teachers", JSON.stringify(defaultTeachers))
    localStorage.setItem("semestralPeriod", "1st Semestral")
    localStorage.setItem("yearLevel", "1st Year")
    toast.success("Settings reset to defaults")
  }

  const handleEditTeacher = (id, name) => {
    setEditingId(id)
    setEditingName(name)
  }

  const handleSaveEdit = (id) => {
    if (editingName.trim()) {
      setTeachers(teachers.map((t) => (t.id === id ? { ...t, name: editingName } : t)))
      setEditingId(null)
      setEditingName("")
      toast.success("Teacher name updated")
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName("")
  }

  const saveAccountInfo = () => {
    // Implement save account info logic here
    toast.success("Account info saved successfully")
  }

  const handlePasswordChange = () => {
    // Implement handle password change logic here
    if (newPassword === confirmPassword) {
      // Save new password logic
      toast.success("Password changed successfully")
    } else {
      toast.error("Passwords do not match")
    }
  }

  const logActivity = (action) => {
    const log = {
      action: action,
      timestamp: Date.now(),
      admin: adminName,
    }
    setActivityLogs([...activityLogs, log])
  }

  const handleLogout = () => {
    // Implement logout logic here
    toast.success("Logged out successfully")
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 flex items-center justify-center">
        <p className="text-gray-600">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard/admin" className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-6">User & Teacher Management</h1>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Settings</CardTitle>
              <CardDescription>Set the current evaluation period and year level</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="semestral">Semestral Period</Label>
                <select
                  id="semestral"
                  value={semestralPeriod}
                  onChange={(e) => setSemestralPeriod(e.target.value)}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {semestralOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="year">Year Level</Label>
                <select
                  id="year"
                  value={yearLevel}
                  onChange={(e) => setYearLevel(e.target.value)}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {yearLevelOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Teachers</CardTitle>
              <CardDescription>Add or remove teachers from the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-teacher">Add New Teacher</Label>
                <div className="flex gap-2">
                  <Input
                    id="new-teacher"
                    value={newTeacher}
                    onChange={(e) => setNewTeacher(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddTeacher()}
                    placeholder="Enter teacher name"
                  />
                  <Button onClick={handleAddTeacher} className="bg-purple-600 hover:bg-purple-700">
                    Add
                  </Button>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-3">Current Teachers</h3>
                <div className="space-y-2">
                  {teachers.map((teacher) => (
                    <div key={teacher.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      {editingId === teacher.id ? (
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="flex-1 mr-2"
                          placeholder="Enter teacher name"
                          autoFocus
                        />
                      ) : (
                        <span>{teacher.name}</span>
                      )}
                      <div className="flex gap-2">
                        {editingId === teacher.id ? (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleSaveEdit(teacher.id)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditTeacher(teacher.id, teacher.name)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteTeacher(teacher.id)}>
                              Remove
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

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
          )}

          {/* Security & Privacy Tab */}
          {activeTab === "security" && (
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
