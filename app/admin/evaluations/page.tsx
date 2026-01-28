"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface StoredEvaluation {
  teacherId: number
  ratings: Record<string, number>
  comments: string
}

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

function loadEvaluationData() {
  const teacherMap: Record<number, { name: string; ratings: number[]; count: number; allComments: string[] }> = {}

  teachers.forEach((teacher) => {
    teacherMap[teacher.id] = { name: teacher.name, ratings: [], count: 0, allComments: [] }
  })

  // Load teacher evaluations
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith("evaluation-")) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || "{}") as StoredEvaluation
        const ratings = Object.values(data.ratings)
        const average = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0
        if (teacherMap[data.teacherId]) {
          teacherMap[data.teacherId].ratings.push(average)
          teacherMap[data.teacherId].count++
          if (data.comments) {
            teacherMap[data.teacherId].allComments.push(data.comments)
          }
        }
      } catch (e) {
        console.error("Error parsing evaluation:", e)
      }
    }
  }

  const teacherData = Object.entries(teacherMap).map(([id, t]) => ({
    id: Number.parseInt(id),
    name: t.name,
    rating:
      t.ratings.length > 0
        ? Number.parseFloat((t.ratings.reduce((a, b) => a + b, 0) / t.ratings.length).toFixed(2))
        : 0,
    count: t.count,
    comments: t.allComments,
  }))

  return teacherData
}

export default function AdminEvaluationsPage() {
  const [teacherStats, setTeacherStats] = useState<
    Array<{ id: number; name: string; rating: number; count: number; comments: string[] }>
  >([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  const refreshData = () => {
    setIsRefreshing(true)
    const data = loadEvaluationData()
    setTeacherStats(data)
    setLastUpdated(new Date().toLocaleTimeString())
    setIsRefreshing(false)
  }

  useEffect(() => {
    refreshData()

    const interval = setInterval(() => {
      refreshData()
    }, 3000)

    const handleEvaluationSubmitted = () => {
      refreshData()
    }

    window.addEventListener("evaluationSubmitted", handleEvaluationSubmitted)

    return () => {
      clearInterval(interval)
      window.removeEventListener("evaluationSubmitted", handleEvaluationSubmitted)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard/admin" className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Teacher Evaluations</h1>
            {lastUpdated && <p className="text-sm text-gray-600">Last updated: {lastUpdated}</p>}
          </div>
          <Button onClick={refreshData} disabled={isRefreshing} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Updating..." : "Refresh Now"}
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Teacher Statistics</CardTitle>
              <CardDescription>Individual performance metrics for all teachers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {teacherStats.map((teacher) => (
                <div key={teacher.id} className="pb-4 border-b last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-lg">{teacher.name}</p>
                      <p className="text-sm text-gray-600">{teacher.count} evaluations submitted</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{teacher.rating.toFixed(2)}/5</p>
                  </div>
                  {teacher.comments.length > 0 && (
                    <div className="mt-3 bg-purple-50 p-3 rounded-md">
                      <p className="text-sm font-semibold mb-2">Comments:</p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {teacher.comments.slice(0, 3).map((comment, idx) => (
                          <li key={idx} className="italic">
                            "{comment}"
                          </li>
                        ))}
                        {teacher.comments.length > 3 && (
                          <li className="text-gray-500">
                            +{teacher.comments.length - 3} more comment{teacher.comments.length - 3 > 1 ? "s" : ""}
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
