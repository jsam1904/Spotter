"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ChevronLeft, ChevronRight, Dumbbell } from "lucide-react"
import { Navbar } from "@/components/ui/Navbar"
import LoadingSpinner from "@/components/loading-spinner"
import LogoutButton from "@/components/LogoutButton"

interface Exercise {
  img: string
  name: string
  description: string
}

export default function ExerciseRecommendations() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [currentExercise, setCurrentExercise] = useState(0)
  const [savedExercises, setSavedExercises] = useState<number[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)

  // Obtener email del token
  const getEmailFromToken = () => {
    const token = localStorage.getItem("token")
    if (!token) return null
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      return payload.email
    } catch {
      return null
    }
  }

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true)
      const email = getEmailFromToken()
      if (!email) {
        setExercises([])
        setLoading(false)
        return
      }
      try {
        const res = await axios.get(`http://localhost:3000/users/${email}/recommendations`)
        setExercises(res.data.exercises || [])
      } catch {
        setExercises([])
      }
      setLoading(false)
    }
    fetchExercises()
  }, [])

  const links = [
    { href: "/UserPage", label: "Inicio" },
    { href: "/match", label: "Match" },
    { href: "/Psettings", label: "Perfil" },
  ]
  


  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) setCurrentExercise(currentExercise + 1)
  }

  const prevExercise = () => {
    if (currentExercise > 0) setCurrentExercise(currentExercise - 1)
  }

  const toggleSaveExercise = (idx: number) => {
    if (savedExercises.includes(idx)) {
      setSavedExercises(savedExercises.filter((i) => i !== idx))
    } else {
      setSavedExercises([...savedExercises, idx])
    }
  }

  if (loading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className={`flex min-h-screen flex-col transition duration-700 ease-in-out ${isDarkMode ? "bg-[#222b4b] text-white" : "bg-white text-black"}`}>
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} links={links} />
      <main className="flex-1 container py-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">Ejercicios Recomendados</h2>
          </div>

          <Tabs defaultValue="discover" className="w-full">
            <TabsList className="w-full grid grid-cols-1">
              <TabsTrigger value="discover">Descubrir</TabsTrigger>
            </TabsList>

            <TabsContent value="discover" className="space-y-6">
              {exercises.length === 0 ? (
                <div className="text-center py-12">
                  <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No hay ejercicios recomendados</h3>
                  <p className="text-muted-foreground">Prueba actualizar tus preferencias</p>
                </div>
              ) : (
                <Card className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={exercises[currentExercise]?.img || "/placeholder.svg"}
                      alt={exercises[currentExercise]?.name || "Ejercicio"}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-xl font-bold text-white">
                        {exercises[currentExercise]?.name || "Ejercicio"}
                      </h3>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4">
                      {exercises[currentExercise]?.description || ""}
                    </p>
                    <div className="flex justify-between items-center mt-6">
                      <Button variant="outline" size="icon" onClick={prevExercise} disabled={currentExercise === 0}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={savedExercises.includes(currentExercise) ? "default" : "outline"}
                        className={savedExercises.includes(currentExercise) ? "bg-rose-600 hover:bg-rose-700" : ""}
                        onClick={() => toggleSaveExercise(currentExercise)}
                        disabled={!exercises.length}
                      >
                        <Heart
                          className={`h-4 w-4 mr-2 ${savedExercises.includes(currentExercise) ? "fill-current" : ""}`}
                        />
                        {savedExercises.includes(currentExercise) ? "Guardado" : "Guardar"}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={nextExercise}
                        disabled={currentExercise === exercises.length - 1 || exercises.length === 0}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="saved" className="space-y-4">
              {savedExercises.length === 0 ? (
                <div className="text-center py-12">
                  <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No hay ejercicios guardados</h3>
                  <p className="text-muted-foreground">Guarda ejercicios para verlos aquí</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedExercises.map((idx) => (
                    <Card key={idx} className="overflow-hidden">
                      <div className="relative">
                        <img
                          src={exercises[idx]?.img || "/placeholder.svg"}
                          alt={exercises[idx]?.name}
                          className="w-full h-40 object-cover"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                          onClick={() => toggleSaveExercise(idx)}
                        >
                          <Heart className="h-4 w-4 fill-rose-600 text-rose-600" />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold">{exercises[idx]?.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{exercises[idx]?.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
