"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface PendingEvaluation {
  teacherId: number
  teacherName: string
  submittedAt: string
  status: string
}

interface Evaluation {
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

const evaluationCriteria = [
  {
    id: "quality",
    label: "Teaching Quality & Classroom Management",
    questions: [
      "Does the teacher explain concepts clearly?",
      "Is the classroom environment conducive to learning?",
      "Does the teacher manage class time effectively?",
    ],
  },
  {
    id: "engagement",
    label: "Student Engagement & Learning Outcomes",
    questions: [
      "Does the teacher engage students in learning?",
      "Are students motivated to learn?",
      "Do you feel you are learning effectively?",
    ],
  },
  {
    id: "development",
    label: "Professional Development & Growth",
    questions: [
      "Does the teacher encourage critical thinking?",
      "Does the teacher provide constructive feedback?",
      "Does the teacher stay updated with latest teaching methods?",
    ],
  },
]

export default function EvaluatePage() {
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null)
  const [currentCriteria, setCurrentCriteria] = useState(0)
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [comments, setComments] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [pendingEvaluations, setPendingEvaluations] = useState<PendingEvaluation[]>([])
  const [showPending, setShowPending] = useState(false)

  const completedTeachers = new Set<number>()

  const handleRatingChange = (question: string, value: string) => {
    setRatings((prev) => ({
      ...prev,
      [question]: Number.parseInt(value),
    }))
  }

  const isCurrentPageComplete = () => {
    const currentQuestions = evaluationCriteria[currentCriteria].questions
    return currentQuestions.every((question) => ratings[question])
  }

  const areAllPagesComplete = () => {
    return evaluationCriteria.every((criteria) =>
      criteria.questions.every((question) => ratings[question]),
    )
  }

  const handleNextPage = () => {
    if (!isCurrentPageComplete()) {
      toast.error("Please answer all questions on this page before proceeding")
      return
    }
    setCurrentCriteria(currentCriteria + 1)
  }

  const handleSubmit = () => {
    if (!selectedTeacher || !areAllPagesComplete()) {
      toast.error("Please answer all questions before submitting")
      return
    }

    const selectedTeacherName = teachers.find((t) => t.id === selectedTeacher)?.name || "Unknown"

    const evaluation: Evaluation = {
      teacherId: selectedTeacher,
      ratings,
      comments,
    }

    localStorage.setItem(`evaluation-${selectedTeacher}-${Date.now()}`, JSON.stringify(evaluation))

    toast.success("Evaluation submitted successfully! Status: Pending")
    setSubmitted(true)
    setTimeout(() => {
      setSelectedTeacher(null)
      setCurrentCriteria(0)
      setRatings({})
      setComments("")
      setSubmitted(false)
    }, 2000)

    window.dispatchEvent(new Event("evaluationSubmitted"))
  }

  const loadPendingEvaluations = () => {
    const pendingEvals: PendingEvaluation[] = []
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("pending-evaluation-")) {
        const value = localStorage.getItem(key)
        if (value) {
          const pendingEval: PendingEvaluation = JSON.parse(value)
          pendingEvals.push(pendingEval)
        }
      }
    })
    setPendingEvaluations(pendingEvals)
  }

  const getIncompletePendingEvaluations = () => {
    return pendingEvaluations.filter((teacher) => !completedTeachers.has(teacher.teacherId))
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-green-600">Thank You!</CardTitle>
            <CardDescription>Your evaluation has been submitted successfully</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard/student" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {showPending && (
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Pending Evaluations</h1>
            <ul className="list-disc list-inside">
              {getIncompletePendingEvaluations().map((pendingEval, idx) => (
                <li key={idx}>
                  {pendingEval.teacherName} - Submitted at {pendingEval.submittedAt}
                </li>
              ))}
            </ul>
            <Button
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setShowPending(false)}
            >
              Close
            </Button>
          </div>
        )}

        {!showPending && getIncompletePendingEvaluations().length > 0 && (
          <Button
            className="mb-4 w-full bg-orange-600 hover:bg-orange-700 text-white"
            onClick={() => setShowPending(true)}
          >
            View Pending Evaluations ({getIncompletePendingEvaluations().length})
          </Button>
        )}

        {!selectedTeacher ? (
          <div>
            <h1 className="text-3xl font-bold mb-6">Select Teacher to Evaluate</h1>
            <div className="grid gap-4">
              {teachers.map((teacher) => (
                <Card
                  key={teacher.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedTeacher(teacher.id)}
                >
                  <CardHeader>
                    <CardTitle>{teacher.name}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">
                Evaluate {teachers.find((t) => t.id === selectedTeacher)?.name}
              </h1>
              <p className="text-gray-600">
                Step {currentCriteria + 1} of {evaluationCriteria.length}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{evaluationCriteria[currentCriteria].label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {evaluationCriteria[currentCriteria].questions.map((question, idx) => (
                  <div key={idx} className="space-y-3">
                    <Label className="text-base font-medium">{question}</Label>
                    <RadioGroup
                      value={String(ratings[question] || "")}
                      onValueChange={(value) => handleRatingChange(question, value)}
                    >
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <div key={rating} className="flex items-center gap-2">
                          <RadioGroupItem value={String(rating)} id={`q${idx}r${rating}`} />
                          <Label htmlFor={`q${idx}r${rating}`} className="font-normal cursor-pointer">
                            {rating === 1 && "Strongly Disagree"}
                            {rating === 2 && "Disagree"}
                            {rating === 3 && "Neutral"}
                            {rating === 4 && "Agree"}
                            {rating === 5 && "Strongly Agree"}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}

                {currentCriteria === evaluationCriteria.length - 1 && (
                  <div className="space-y-3 pt-4 border-t">
                    <Label htmlFor="comments" className="text-base font-medium">
                      Additional Comments (Optional)
                    </Label>
                    <Textarea
                      id="comments"
                      placeholder="Share any additional feedback or suggestions..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      className="min-h-24"
                    />
                  </div>
                )}

                <div className="flex gap-4 pt-6">
                  {currentCriteria > 0 && (
                    <Button variant="outline" onClick={() => setCurrentCriteria(currentCriteria - 1)}>
                      Previous
                    </Button>
                  )}
                  {currentCriteria < evaluationCriteria.length - 1 ? (
                    <Button onClick={handleNextPage} className="flex-1" disabled={!isCurrentPageComplete()}>
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={!areAllPagesComplete()}
                    >
                      Submit Evaluation
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSelectedTeacher(null)
                      setRatings({})
                      setComments("")
                      setCurrentCriteria(0)
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
