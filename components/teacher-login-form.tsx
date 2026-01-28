"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { ArrowRight, Users } from "lucide-react"

export function TeacherLoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: "", password: "" })
  const [authMode, setAuthMode] = useState<"login" | "signup" | "forgotPassword">("login")
  const [signupForm, setSignupForm] = useState({ email: "", password: "", confirmPassword: "", fullName: "" })
  const [resetEmail, setResetEmail] = useState("")

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.email || !form.password) {
      toast.error("Please fill in all fields")
      return
    }

    if (!form.email.includes("@")) {
      toast.error("Please enter a valid email")
      return
    }

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    localStorage.setItem("userRole", "teacher")
    localStorage.setItem("userEmail", form.email)
    localStorage.setItem("sessionId", Math.random().toString(36).substring(7))

    toast.success("Login successful!")
    router.push("/dashboard/teacher")
    setLoading(false)
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!signupForm.email || !signupForm.password || !signupForm.confirmPassword || !signupForm.fullName) {
      toast.error("Please fill in all fields")
      return
    }

    if (!signupForm.email.includes("@")) {
      toast.error("Please enter a valid email")
      return
    }

    if (signupForm.password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    const accounts = JSON.parse(localStorage.getItem("teacherAccounts") || "[]")
    if (accounts.some((acc: any) => acc.email === signupForm.email)) {
      toast.error("Email already registered")
      setLoading(false)
      return
    }

    accounts.push({
      email: signupForm.email,
      password: signupForm.password,
      fullName: signupForm.fullName,
    })
    localStorage.setItem("teacherAccounts", JSON.stringify(accounts))

    toast.success("Account created successfully! Please log in.")
    setAuthMode("login")
    setSignupForm({ email: "", password: "", confirmPassword: "", fullName: "" })
    setLoading(false)
  }

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!resetEmail) {
      toast.error("Please enter your email")
      return
    }

    if (!resetEmail.includes("@")) {
      toast.error("Please enter a valid email")
      return
    }

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    const accounts = JSON.parse(localStorage.getItem("teacherAccounts") || "[]")
    const account = accounts.find((acc: any) => acc.email === resetEmail)

    if (!account) {
      toast.error("No account found with this email")
      setLoading(false)
      return
    }

    toast.success("Password reset link sent to your email. For demo: your password remains the same.")
    setAuthMode("login")
    setResetEmail("")
    setLoading(false)
  }

  return (
    <Card className="border-slate-700 bg-slate-800">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-amber-400" />
          <CardTitle className="text-white">
            {authMode === "login" ? "Teacher Login" : authMode === "signup" ? "Create Account" : "Reset Password"}
          </CardTitle>
        </div>
        <CardDescription className="text-slate-400">
          {authMode === "login"
            ? "Enter your credentials to access teacher portal"
            : authMode === "signup"
              ? "Create a new teacher account"
              : "Reset your password"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {authMode === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teacher-email" className="text-slate-200">
                Email Address
              </Label>
              <Input
                id="teacher-email"
                type="email"
                placeholder="teacher@school.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher-password" className="text-slate-200">
                Password
              </Label>
              <Input
                id="teacher-password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white" disabled={loading}>
              {loading ? (
                "Logging in..."
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Sign In <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 text-slate-300 border-slate-600 hover:bg-slate-700 bg-transparent"
                onClick={() => setAuthMode("signup")}
              >
                Create Account
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 text-slate-300 border-slate-600 hover:bg-slate-700 bg-transparent"
                onClick={() => setAuthMode("forgotPassword")}
              >
                Forgot Password?
              </Button>
            </div>
          </form>
        )}

        {authMode === "signup" && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teacher-signup-name" className="text-slate-200">
                Full Name
              </Label>
              <Input
                id="teacher-signup-name"
                type="text"
                placeholder="John Doe"
                value={signupForm.fullName}
                onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher-signup-email" className="text-slate-200">
                Email Address
              </Label>
              <Input
                id="teacher-signup-email"
                type="email"
                placeholder="teacher@school.com"
                value={signupForm.email}
                onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher-signup-password" className="text-slate-200">
                Password
              </Label>
              <Input
                id="teacher-signup-password"
                type="password"
                placeholder="••••••••"
                value={signupForm.password}
                onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher-signup-confirm" className="text-slate-200">
                Confirm Password
              </Label>
              <Input
                id="teacher-signup-confirm"
                type="password"
                placeholder="••••••••"
                value={signupForm.confirmPassword}
                onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full text-slate-300 border-slate-600 hover:bg-slate-700 bg-transparent"
              onClick={() => {
                setAuthMode("login")
                setSignupForm({ email: "", password: "", confirmPassword: "", fullName: "" })
              }}
            >
              Back to Login
            </Button>
          </form>
        )}

        {authMode === "forgotPassword" && (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teacher-reset-email" className="text-slate-200">
                Email Address
              </Label>
              <Input
                id="teacher-reset-email"
                type="email"
                placeholder="teacher@school.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                disabled={loading}
              />
            </div>
            <p className="text-xs text-slate-400">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full text-slate-300 border-slate-600 hover:bg-slate-700 bg-transparent"
              onClick={() => {
                setAuthMode("login")
                setResetEmail("")
              }}
            >
              Back to Login
            </Button>
          </form>
        )}

        <div className="mt-4 pt-4 border-t border-slate-600">
          <p className="text-xs text-slate-400 text-center">Demo mode: Sign up with any email/password</p>
        </div>
      </CardContent>
    </Card>
  )
}
