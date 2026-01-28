"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

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

interface PendingServiceFeedback {
  serviceId: number;
  serviceName: string;
  submittedAt: string;
  status: string;
}

export default function ServicesFeedbackPage() {
  const [selectedService, setSelectedService] = useState<number | null>(null)
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [feedback, setFeedback] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [showPending, setShowPending] = useState(false)
  const [pendingFeedback, setPendingFeedback] = useState<PendingServiceFeedback[]>([])

  const completedServices = new Set<number>([1, 2]) // Example completed services

  const getIncompletePendingServices = () => {
    return services.filter((service) => !completedServices.has(service.id))
  }

  const ratingCriteria = [
    { criterion: "quality", label: "Quality of Service" },
    { criterion: "accessibility", label: "Accessibility & Availability" },
    { criterion: "staff", label: "Staff Helpfulness" },
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
      userRole: "student",
      serviceId: selectedService,
      ratings,
      feedback,
      timestamp: new Date().toISOString(),
    }

    const serviceName = services.find((s) => s.id === selectedService)?.name || "Unknown"

    localStorage.setItem(`service-feedback-student-${selectedService}-${Date.now()}`, JSON.stringify(serviceFeedback))

    toast.success("Feedback submitted successfully! Status: Pending")
    setSubmitted(true)
    setTimeout(() => {
      setSelectedService(null)
      setRatings({})
      setFeedback("")
      setSubmitted(false)
    }, 2000)
  }

  const loadPendingFeedback = () => {
    const pendingFeedbackItems: PendingServiceFeedback[] = []
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("pending-service-feedback-")) {
        const feedbackItem = JSON.parse(localStorage.getItem(key) || "{}")
        pendingFeedbackItems.push(feedbackItem)
      }
    })
    setPendingFeedback(pendingFeedbackItems)
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard/student" className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>



        {!selectedService ? (
          <div>
            <h1 className="text-3xl font-bold mb-6">Select Service to Review</h1>
            <div className="grid gap-4">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedService(service.id)}
                >
                  <CardHeader>
                    <CardTitle>{service.name}</CardTitle>
                    <CardDescription>{service.category}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-6">
              Feedback for {services.find((s) => s.id === selectedService)?.name}
            </h1>

            <Card>
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
                    className="flex-1 bg-green-600 hover:bg-green-700"
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
