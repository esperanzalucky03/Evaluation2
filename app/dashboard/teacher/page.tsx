"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, FileText, MessageSquare, TrendingUp } from "lucide-react"
import { toast } from "sonner"

interface Evaluation {
  teacherId: number
  ratings: Record<string, number>
  comments: string
}

export default function TeacherDashboard() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [teacherId, setTeacherId] = useState<number | null>(null)
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const loadEvaluationData = () => {
    const email = localStorage.getItem("userEmail")
    const tId = parseInt(email?.split("@")[0] || "1")
    setTeacherId(tId)

    const evaluationKeys = Object.keys(localStorage).filter((key) => key.startsWith("evaluation-"))
    const teacherEvaluations = evaluationKeys
      .map((key) => {
        try {
          return JSON.parse(localStorage.getItem(key) || "")
        } catch {
          return null
        }
      })
      .filter((evaluation): evaluation is Evaluation => evaluation !== null && evaluation.teacherId === tId)

    setEvaluations(teacherEvaluations)

    if (teacherEvaluations.length > 0) {
      const allRatings = teacherEvaluations.flatMap((evaluation) => Object.values(evaluation.ratings))
      const avg = allRatings.reduce((a, b) => a + b, 0) / allRatings.length
      setAverageRating(Number(avg.toFixed(1)))
    }
    setLastUpdate(new Date())
  }

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    const email = localStorage.getItem("userEmail")

    if (userRole !== "teacher") {
      router.push("/login")
      return
    }

    setUserEmail(email || "")
    loadEvaluationData()
    setLoading(false)

    const handleEvaluationSubmitted = () => {
      loadEvaluationData()
    }

    window.addEventListener("evaluationSubmitted", handleEvaluationSubmitted)

    const refreshInterval = setInterval(() => {
      loadEvaluationData()
    }, 3000)

    return () => {
      window.removeEventListener("evaluationSubmitted", handleEvaluationSubmitted)
      clearInterval(refreshInterval)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("sessionId")
    toast.success("Logged out successfully")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-4 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-amber-900 mb-2">Teacher Portal</h1>
            <p className="text-amber-700">Welcome, {userEmail}</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* View Evaluations */}
          <Card className="hover:shadow-lg transition-shadow border-amber-200 md:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-amber-600" />
                <CardTitle>Your Evaluations</CardTitle>
              </div>
              <CardDescription>Real-time view of teacher evaluation results and feedback</CardDescription>
            </CardHeader>
            <CardContent>
              {evaluations.length === 0 ? (
                <p className="text-sm text-slate-600">No evaluations received yet. Check back soon!</p>
              ) : (
                <div className="space-y-4">
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <h3 className="font-semibold text-amber-900 mb-3">Recent Evaluations</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {evaluations.slice().reverse().map((evaluationItem, idx) => {
                        const ratings = Object.values(evaluationItem.ratings)
                        const avgRating = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
                        return (
                          <div
                            key={idx}
                            className="text-sm p-2 bg-white rounded border border-amber-100 flex justify-between items-center"
                          >
                            <div>
                              <p className="font-medium text-amber-900">Rating: {avgRating}/5.0</p>
                              {evaluationItem.comments && (
                                <p className="text-xs text-slate-600 mt-1 line-clamp-1">"{evaluationItem.comments}"</p>
                              )}
                            </div>
                            <div className="text-xs text-slate-500">Just now</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* School Services Feedback */}
          <Card className="hover:shadow-lg transition-shadow border-amber-200">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5 text-amber-600" />
                <CardTitle>School Services</CardTitle>
              </div>
              <CardDescription>Evaluate school facilities and support services</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                Share your feedback on school services, facilities, and administrative support.
              </p>
              <Link href="/teacher/services-feedback" className="w-full block">
                <Button className="w-full bg-amber-600 hover:bg-amber-700">Provide Feedback</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Professional Development */}
          <Card className="hover:shadow-lg transition-shadow border-amber-200">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <CardTitle>Reports</CardTitle>
              </div>
              <CardDescription>Download evaluation reports and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                Access detailed reports and analytics of your evaluation feedback.
              </p>
              <Button className="w-full bg-amber-600 hover:bg-amber-700">View Reports</Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-amber-900">Evaluations Received</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-600">{evaluations.length}</p>
              <p className="text-xs text-slate-600 mt-2">From students this semester</p>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-amber-900">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-600">{evaluations.length > 0 ? averageRating : "N/A"}</p>
              <p className="text-xs text-slate-600 mt-2">Out of 5.0</p>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-amber-900">Last Updated</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-mono text-amber-600">{lastUpdate.toLocaleTimeString()}</p>
              <p className="text-xs text-slate-600 mt-2">Real-time updates enabled</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
