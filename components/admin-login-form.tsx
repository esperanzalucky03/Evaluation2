"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { ArrowRight, Shield } from "lucide-react"

export function AdminLoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ username: "", password: "" })
  const [authMode, setAuthMode] = useState<"login" | "forgotPassword">("login")
  const [resetUsername, setResetUsername] = useState("")

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.username || !form.password) {
      toast.error("Please fill in all fields")
      return
    }

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    localStorage.setItem("userRole", "admin")
    localStorage.setItem("adminUsername", form.username)
    localStorage.setItem("sessionId", Math.random().toString(36).substring(7))

    toast.success("Admin login successful!")
    router.push("/dashboard/admin")
    setLoading(false)
  }

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!resetUsername) {
      toast.error("Please enter your username")
      return
    }

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    toast.success("Password reset link sent to your registered email. For demo: your password remains the same.")
    setAuthMode("login")
    setResetUsername("")
    setLoading(false)
  }

  return (
    <Card className="border-slate-700 bg-slate-800">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-purple-400" />
          <CardTitle className="text-white">
            {authMode === "login" ? "Admin Login" : "Reset Password"}
          </CardTitle>
        </div>
        <CardDescription className="text-slate-400">
          {authMode === "login"
            ? "Enter your admin credentials to manage evaluations"
            : "Reset your admin password"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {authMode === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-username" className="text-slate-200">
                Username
              </Label>
              <Input
                id="admin-username"
                type="text"
                placeholder="admin"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-slate-200">
                Password
              </Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={loading}>
              {loading ? (
                "Logging in..."
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Sign In <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full text-slate-300 border-slate-600 hover:bg-slate-700 bg-transparent"
              onClick={() => setAuthMode("forgotPassword")}
            >
              Forgot Password?
            </Button>
          </form>
        )}

        {authMode === "forgotPassword" && (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-reset-username" className="text-slate-200">
                Username
              </Label>
              <Input
                id="admin-reset-username"
                type="text"
                placeholder="admin"
                value={resetUsername}
                onChange={(e) => setResetUsername(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                disabled={loading}
              />
            </div>
            <p className="text-xs text-slate-400">
              Enter your username and we'll send you a link to reset your password to your registered email.
            </p>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full text-slate-300 border-slate-600 hover:bg-slate-700 bg-transparent"
              onClick={() => {
                setAuthMode("login")
                setResetUsername("")
              }}
            >
              Back to Login
            </Button>
          </form>
        )}

        <div className="mt-4 pt-4 border-t border-slate-600">
          <p className="text-xs text-slate-400 text-center">Demo credentials: Use any username and password</p>
        </div>
      </CardContent>
    </Card>
  )
}
