"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, MessageSquare, Clock, CheckCircle2, LogOut, ArrowRight } from "lucide-react"
import Link from "next/link"

const teachers = [
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

const services = [
  { id: 1, name: "Library Services", category: "Academic" },
  { id: 2, name: "Cafeteria Services", category: "Student Services" },
  { id: 3, name: "Counseling Center", category: "Student Support" },
  { id: 4, name: "IT Support", category: "Technical" },
  { id: 5, name: "Sports Facilities", category: "Recreational" },
  { id: 6, name: "Admin Services", category: "Administrative" },
  { id: 7, name: "Comfort Room Services", category: "Facilities" },
  { id: 8, name: "ComLab and Equipment Services", category: "Technical" },
]

export default function StudentDashboard() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    const email = localStorage.getItem("userEmail")

    if (role !== "student") {
      router.push("/login")
      return
    }

    setUserEmail(email || "")
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("sessionId")
    router.push("/login")
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Navigation Header */}
      <div className="border-b border-blue-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">School Evaluation Hub</h1>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="gap-2 text-gray-700 hover:bg-blue-50">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-lg text-gray-600">{userEmail}</p>
          <p className="text-gray-500 mt-2">Help us improve by sharing your feedback</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <Card className="bg-white border-blue-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Evaluations Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">0</div>
              <p className="text-xs text-gray-500 mt-1">out of 10 teachers</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-green-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Feedback Submitted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">0</div>
              <p className="text-xs text-gray-500 mt-1">out of 8 teachers</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-amber-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Days Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">12</div>
              <p className="text-xs text-gray-500 mt-1">to complete all evaluations</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Teacher Evaluations */}
          <Link href="/evaluate">
            <Card className="cursor-pointer hover:shadow-xl hover:border-blue-300 transition-all duration-300 h-full bg-white border-2 border-blue-100">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">Teacher Evaluations</CardTitle>
                    <CardDescription className="text-base">
                      Rate your teachers across teaching quality, student engagement, and professional growth
                    </CardDescription>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Pending</span>
                      <span className="text-sm font-semibold text-blue-600">0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2">
                    View Your Feedback
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Services Feedback */}
          <Link href="/services-feedback">
            <Card className="cursor-pointer hover:shadow-xl hover:border-purple-300 transition-all duration-300 h-full bg-white border-2 border-purple-100">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">Services Feedback</CardTitle>
                    <CardDescription className="text-base">
                      Share your thoughts about school facilities, support services, and administrative services
                    </CardDescription>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Pending</span>
                      <span className="text-sm font-semibold text-blue-600">0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-2">
                    View Your Feedback
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Important Information
          </h3>
          <ul className="text-gray-700 space-y-2 text-sm">
            <li>• Your feedback is confidential and will only be reviewed by administrators</li>
            <li>• Please provide honest and constructive feedback</li>
            <li>• Evaluation period closes on January 31, 2026</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
