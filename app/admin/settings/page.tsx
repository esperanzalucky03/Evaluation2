"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Edit2, Check, X } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

const defaultTeachers = [
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

export default function AdminSettingsPage() {
  const [teachers, setTeachers] = useState(defaultTeachers)
  const [newTeacher, setNewTeacher] = useState("")
  const [semestralPeriod, setSemestralPeriod] = useState("1st Semestral")
  const [yearLevel, setYearLevel] = useState("1st Year")
  const [evaluationPeriod, setEvaluationPeriod] = useState("Spring 2024")
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem("teachers")
    const savedSemestral = localStorage.getItem("semestralPeriod")
    const savedYear = localStorage.getItem("yearLevel")
    const savedPeriod = localStorage.getItem("evaluationPeriod")

    if (saved) setTeachers(JSON.parse(saved))
    if (savedSemestral) setSemestralPeriod(savedSemestral)
    if (savedYear) setYearLevel(savedYear)
    if (savedPeriod) setEvaluationPeriod(savedPeriod)
    setIsLoading(false)
  }, [])

  const semestralOptions = ["1st Semestral", "2nd Semestral", "3rd Semestral", "4th Semestral"]
  const yearLevelOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"]

  const handleAddTeacher = () => {
    if (newTeacher.trim()) {
      const newId = Math.max(...teachers.map((t) => t.id), 0) + 1
      setTeachers([...teachers, { id: newId, name: newTeacher }])
      setNewTeacher("")
      toast.success("Teacher added successfully")
    }
  }

  const handleDeleteTeacher = (id: number) => {
    setTeachers(teachers.filter((t) => t.id !== id))
    toast.success("Teacher removed")
  }

  const handleSaveSettings = () => {
    localStorage.setItem("semestralPeriod", semestralPeriod)
    localStorage.setItem("yearLevel", yearLevel)
    localStorage.setItem("teachers", JSON.stringify(teachers))
    toast.success("Settings saved successfully")
  }

  const handleResetToDefaults = () => {
    setTeachers(defaultTeachers)
    setSemestralPeriod("1st Semestral")
    setYearLevel("1st Year")
    localStorage.setItem("teachers", JSON.stringify(defaultTeachers))
    localStorage.setItem("semestralPeriod", "1st Semestral")
    localStorage.setItem("yearLevel", "1st Year")
    toast.success("Settings reset to defaults")
  }

  const handleEditTeacher = (id, name) => {
    setEditingId(id)
    setEditingName(name)
  }

  const handleSaveEdit = (id) => {
    if (editingName.trim()) {
      setTeachers(teachers.map((t) => (t.id === id ? { ...t, name: editingName } : t)))
      setEditingId(null)
      setEditingName("")
      toast.success("Teacher name updated")
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName("")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 flex items-center justify-center">
        <p className="text-gray-600">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard/admin" className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-6">Settings & User Management</h1>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Settings</CardTitle>
              <CardDescription>Set the current evaluation period and year level</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="semestral">Semestral Period</Label>
                <select
                  id="semestral"
                  value={semestralPeriod}
                  onChange={(e) => setSemestralPeriod(e.target.value)}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {semestralOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="year">Year Level</Label>
                <select
                  id="year"
                  value={yearLevel}
                  onChange={(e) => setYearLevel(e.target.value)}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {yearLevelOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Teachers</CardTitle>
              <CardDescription>Add or remove teachers from the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-teacher">Add New Teacher</Label>
                <div className="flex gap-2">
                  <Input
                    id="new-teacher"
                    value={newTeacher}
                    onChange={(e) => setNewTeacher(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddTeacher()}
                    placeholder="Enter teacher name"
                  />
                  <Button onClick={handleAddTeacher} className="bg-purple-600 hover:bg-purple-700">
                    Add
                  </Button>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-3">Current Teachers</h3>
                <div className="space-y-2">
                  {teachers.map((teacher) => (
                    <div key={teacher.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      {editingId === teacher.id ? (
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="flex-1 mr-2"
                          placeholder="Enter teacher name"
                          autoFocus
                        />
                      ) : (
                        <span>{teacher.name}</span>
                      )}
                      <div className="flex gap-2">
                        {editingId === teacher.id ? (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleSaveEdit(teacher.id)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditTeacher(teacher.id, teacher.name)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteTeacher(teacher.id)}>
                              Remove
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={handleSaveSettings} className="bg-green-600 hover:bg-green-700">
              Save Changes
            </Button>
            <Button variant="outline" onClick={handleResetToDefaults}>
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
