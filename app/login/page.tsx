"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentLoginForm } from "@/components/student-login-form"
import { AdminLoginForm } from "@/components/admin-login-form"
import { TeacherLoginForm } from "@/components/teacher-login-form"

export default function LoginPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("student")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Teacher Evaluation System</h1>
          <p className="text-slate-300">Secure login for students, teachers, and administrators</p>
        </div>

        {/* Login Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="teacher">Teacher</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>

          {/* Student Login */}
          <TabsContent value="student">
            <StudentLoginForm />
          </TabsContent>

          {/* Teacher Login */}
          <TabsContent value="teacher">
            <TeacherLoginForm />
          </TabsContent>

          {/* Admin Login */}
          <TabsContent value="admin">
            <AdminLoginForm />
          </TabsContent>
        </Tabs>

        {/* Demo Info */}
        <div className="mt-6 p-4 rounded-lg bg-slate-700/50 border border-slate-600">
          <p className="text-sm text-slate-300 text-center">
            This is a demo system. Use any credentials to log in for testing purposes.
          </p>
        </div>
      </div>
    </div>
  )
}
