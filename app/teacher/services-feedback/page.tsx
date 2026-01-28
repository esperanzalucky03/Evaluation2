"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

const services = [
  { id: 1, name: "Staff Resources & Support", category: "Administrative" },
  { id: 2, name: "Facilities & Equipment", category: "Infrastructure" },
  { id: 3, name: "Professional Development", category: "Training" },
  { id: 4, name: "IT Support & Systems", category: "Technical" },
  { id: 5, name: "Administrative Services", category: "Management" },
  { id: 6, name: "Admin Services", category: "Administrative" },
  { id: 7, name: "Comfort Room Services", category: "Facilities" },
  { id: 8, name: "ComLab and Equipment Services", category: "Technical" },
]

export default function TeacherServicesFeedbackPage() {
  const router = useRouter()
  const [selectedService, setSelectedService] = useState<number | null>(null)
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [feedback, setFeedback] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    if (userRole !== "teacher") {
      router.push("/login")
      return
    }
    setLoading(false)
  }, [router])

  const ratingCriteria = [
    { criterion: "quality", label: "Quality of Service" },
    { criterion: "accessibility", label: "Accessibility & Availability" },
    { criterion: "support", label: "Support Quality" },
    { criterion: "satisfaction", label: "Overall Satisfaction" },
  ]

  const handleRatingChange = (criterion: string, value: string) => {
    setRatings((prev) => ({
      ...prev,
      [criterion]: Number.parseInt(value),
    }))
  }

  const areAllRatingsComplete = () => {
    return ratingCriteria.every((item) => ratings[item.criterion])
  }

  const handleSubmit = () => {
    if (!selectedService || !areAllRatingsComplete()) {
      toast.error("Please rate all criteria before submitting")
      return
    }

    const serviceFeedback = {
      userRole: "teacher",
      serviceId: selectedService,
      ratings,
      feedback,
      timestamp: new Date().toISOString(),
    }

    localStorage.setItem(`service-feedback-teacher-${selectedService}-${Date.now()}`, JSON.stringify(serviceFeedback))

    toast.success("Feedback submitted successfully!")
    setSubmitted(true)
    setTimeout(() => {
      setSelectedService(null)
      setRatings({})
      setFeedback("")
      setSubmitted(false)
    }, 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-4 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-green-600">Thank You!</CardTitle>
            <CardDescription>Your feedback has been received</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard/teacher" className="flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {!selectedService ? (
          <div>
            <h1 className="text-3xl font-bold mb-2 text-amber-900">School Services Feedback</h1>
            <p className="text-amber-700 mb-6">Select a service area to provide your feedback and suggestions</p>
            <div className="grid gap-4">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow border-amber-200"
                  onClick={() => setSelectedService(service.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-amber-900">{service.name}</CardTitle>
                    <CardDescription>{service.category}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-2 text-amber-900">
              Feedback for {services.find((s) => s.id === selectedService)?.name}
            </h1>

            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle>Rate This Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {ratingCriteria.map((item) => (
                  <div key={item.criterion} className="space-y-3">
                    <Label className="text-base font-medium">{item.label}</Label>
                    <RadioGroup
                      value={String(ratings[item.criterion] || "")}
                      onValueChange={(value) => handleRatingChange(item.criterion, value)}
                    >
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <div key={rating} className="flex items-center gap-2">
                          <RadioGroupItem value={String(rating)} id={`${item.criterion}${rating}`} />
                          <Label htmlFor={`${item.criterion}${rating}`} className="font-normal cursor-pointer">
                            {rating === 1 && "Poor"}
                            {rating === 2 && "Fair"}
                            {rating === 3 && "Good"}
                            {rating === 4 && "Very Good"}
                            {rating === 5 && "Excellent"}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}

                <div className="space-y-3 pt-4 border-t">
                  <Label htmlFor="feedback" className="text-base font-medium">
                    Suggestions for Improvement
                  </Label>
                  <Textarea
                    id="feedback"
                    placeholder="Share your suggestions or concerns..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-24"
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 bg-amber-600 hover:bg-amber-700"
                    disabled={!areAllRatingsComplete()}
                  >
                    Submit Feedback
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedService(null)
                      setRatings({})
                      setFeedback("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
