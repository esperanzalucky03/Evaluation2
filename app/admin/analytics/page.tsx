"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, TrendingUp, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

interface StoredEvaluation {
  teacherId: number
  ratings: Record<string, number>
  comments: string
}

interface ServiceFeedback {
  serviceId: number
  ratings: Record<string, number>
  feedback: string
  timestamp: string
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

const services = [
  { id: 1, name: "Library Services" },
  { id: 2, name: "Cafeteria Services" },
  { id: 3, name: "Counseling Center" },
  { id: 4, name: "IT Support" },
  { id: 5, name: "Sports Facilities" },
  { id: 6, name: "Admin Services" },
  { id: 7, name: "Comfort Room Services" },
  { id: 8, name: "ComLab and Equipment Services" },
]

function loadAnalyticsData() {
  const teacherMap: Record<number, { name: string; ratings: number[]; count: number }> = {}
  const serviceMap: Record<number, { name: string; ratings: number[]; count: number }> = {}

  // Initialize teacher map with actual teacher names
  teachers.forEach((teacher) => {
    teacherMap[teacher.id] = { name: teacher.name, ratings: [], count: 0 }
  })

  // Initialize service map
  services.forEach((service) => {
    serviceMap[service.id] = { name: service.name, ratings: [], count: 0 }
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
        }
      } catch (e) {
        console.error("Error parsing evaluation:", e)
      }
    }
  }

  // Load service feedback
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith("service-feedback-")) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || "{}") as ServiceFeedback
        const ratings = Object.values(data.ratings)
        const average = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0
        if (serviceMap[data.serviceId]) {
          serviceMap[data.serviceId].ratings.push(average)
          serviceMap[data.serviceId].count++
        }
      } catch (e) {
        console.error("Error parsing feedback:", e)
      }
    }
  }

  const teacherData = Object.values(teacherMap).map((t) => ({
    name: t.name,
    rating:
      t.ratings.length > 0
        ? Number.parseFloat((t.ratings.reduce((a, b) => a + b, 0) / t.ratings.length).toFixed(2))
        : 0,
    count: t.count,
  }))

  const serviceData = Object.values(serviceMap).map((s) => ({
    name: s.name,
    rating:
      s.ratings.length > 0
        ? Number.parseFloat((s.ratings.reduce((a, b) => a + b, 0) / s.ratings.length).toFixed(2))
        : 0,
    count: s.count,
  }))

  return { teacherData, serviceData }
}

export default function AdminAnalyticsPage() {
  const [teacherStats, setTeacherStats] = useState<Array<{ name: string; rating: number; count: number }>>([])
  const [serviceStats, setServiceStats] = useState<Array<{ name: string; rating: number; count: number }>>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  const refreshData = () => {
    setIsRefreshing(true)
    const { teacherData, serviceData } = loadAnalyticsData()
    setTeacherStats(teacherData)
    setServiceStats(serviceData)
    setLastUpdated(new Date().toLocaleTimeString())
    setIsRefreshing(false)
  }

  useEffect(() => {
    refreshData()

    const interval = setInterval(() => {
      refreshData()
    }, 3000)

    return () => clearInterval(interval)
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
            <h1 className="text-3xl font-bold mb-2">Analytics & Reports</h1>
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
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Teacher Performance Summary
              </CardTitle>
              <CardDescription>Average ratings and evaluation counts (updates in real-time)</CardDescription>
            </CardHeader>
            <CardContent>
              {teacherStats.some((t) => t.count > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={teacherStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip formatter={(value) => (typeof value === "number" ? value.toFixed(2) : value)} />
                    <Legend />
                    <Bar dataKey="rating" fill="#8b5cf6" name="Average Rating" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500 py-8">No evaluation data available yet</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Services Satisfaction
              </CardTitle>
              <CardDescription>Average satisfaction ratings for school services (updates in real-time)</CardDescription>
            </CardHeader>
            <CardContent>
              {serviceStats.some((s) => s.count > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={serviceStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip formatter={(value) => (typeof value === "number" ? value.toFixed(2) : value)} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="rating"
                      stroke="#10b981"
                      name="Satisfaction Rating"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500 py-8">No feedback data available yet</p>
              )}
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Teacher Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {teacherStats.map((teacher) => (
                  <div key={teacher.name} className="flex justify-between items-center pb-3 border-b last:border-0">
                    <div>
                      <p className="font-medium">{teacher.name}</p>
                      <p className="text-sm text-gray-600">{teacher.count} evaluations</p>
                    </div>
                    <p className="text-lg font-bold text-purple-600">{teacher.rating.toFixed(2)}/5</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {serviceStats.map((service) => (
                  <div key={service.name} className="flex justify-between items-center pb-3 border-b last:border-0">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-600">{service.count} feedbacks</p>
                    </div>
                    <p className="text-lg font-bold text-green-600">{service.rating.toFixed(2)}/5</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
