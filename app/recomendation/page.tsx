"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Filter, ChevronLeft, ChevronRight, Sun, Moon, Menu, Dumbbell } from "lucide-react"
import { DarkModeToggle } from "@/components/ui/DarkModeToggle"

// Datos de ejemplo para ejercicios
const exercisesData = [
  {
    id: 1,
    name: "Press de banca",
    category: "pecho",
    difficulty: "intermedio",
    equipment: "barra",
    description:
      "El press de banca es un ejercicio compuesto que desarrolla principalmente el pectoral mayor, los deltoides anteriores y los tríceps.",
    steps: [
      "Acuéstate en un banco plano con los pies apoyados en el suelo.",
      "Agarra la barra con las manos un poco más separadas que el ancho de los hombros.",
      "Baja la barra lentamente hasta que toque ligeramente tu pecho.",
      "Empuja la barra hacia arriba hasta que tus brazos estén completamente extendidos.",
    ],
    image: "https://via.placeholder.com/400x300?text=Press+de+Banca",
    muscles: ["pectorales", "deltoides", "tríceps"],
  },
  {
    id: 2,
    name: "Sentadillas",
    category: "piernas",
    difficulty: "intermedio",
    equipment: "barra",
    description:
      "La sentadilla es un ejercicio compuesto que trabaja principalmente los cuádriceps, los glúteos y los isquiotibiales.",
    steps: [
      "Coloca la barra sobre tus trapecios (no sobre tu cuello).",
      "Separa los pies al ancho de los hombros con las puntas ligeramente hacia afuera.",
      "Baja flexionando las rodillas y las caderas, manteniendo la espalda recta.",
      "Baja hasta que tus muslos estén paralelos al suelo o un poco más abajo.",
      "Empuja a través de los talones para volver a la posición inicial.",
    ],
    image: "https://via.placeholder.com/400x300?text=Sentadillas",
    muscles: ["cuádriceps", "glúteos", "isquiotibiales", "core"],
  },
  {
    id: 3,
    name: "Peso muerto",
    category: "espalda",
    difficulty: "avanzado",
    equipment: "barra",
    description:
      "El peso muerto es un ejercicio compuesto que trabaja prácticamente todos los músculos del cuerpo, con énfasis en la espalda baja, los glúteos y los isquiotibiales.",
    steps: [
      "Párate con los pies separados al ancho de las caderas y la barra sobre el medio del pie.",
      "Flexiona las caderas y las rodillas para agarrar la barra con las manos justo fuera de las piernas.",
      "Levanta el pecho y aplana la espalda.",
      "Empuja a través de los talones, extendiendo las caderas y las rodillas para levantar la barra.",
      "Baja la barra controladamente flexionando las caderas y las rodillas.",
    ],
    image: "https://via.placeholder.com/400x300?text=Peso+Muerto",
    muscles: ["espalda baja", "glúteos", "isquiotibiales", "trapecios"],
  },
  {
    id: 4,
    name: "Pull-ups",
    category: "espalda",
    difficulty: "intermedio",
    equipment: "barra de dominadas",
    description:
      "Las dominadas son un ejercicio compuesto que trabaja principalmente la espalda, los bíceps y los antebrazos.",
    steps: [
      "Agarra la barra con las palmas hacia afuera y las manos separadas un poco más que el ancho de los hombros.",
      "Cuelga completamente con los brazos extendidos.",
      "Tira de tu cuerpo hacia arriba hasta que tu barbilla esté por encima de la barra.",
      "Baja controladamente hasta la posición inicial.",
    ],
    image: "https://via.placeholder.com/400x300?text=Pull-ups",
    muscles: ["dorsal ancho", "bíceps", "antebrazos", "romboides"],
  },
]

export default function ExerciseRecommendations() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentExercise, setCurrentExercise] = useState(0)
  const [savedExercises, setSavedExercises] = useState<number[]>([])
  const [muscleFilter, setMuscleFilter] = useState("all")

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme")
    if (storedTheme === "dark") {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    if (newMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const nextExercise = () => {
    if (currentExercise < filteredExercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
    }
  }

  const prevExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1)
    }
  }

  const toggleSaveExercise = (id: number) => {
    if (savedExercises.includes(id)) {
      setSavedExercises(savedExercises.filter((exerciseId) => exerciseId !== id))
    } else {
      setSavedExercises([...savedExercises, id])
    }
  }

  const filteredExercises = exercisesData.filter(
    (exercise) => muscleFilter === "all" || exercise.category === muscleFilter,
  )

  useEffect(() => {
    setCurrentExercise(0)
  }, [muscleFilter])

  return (
    <div
      className={`flex min-h-screen flex-col transition duration-700 ease-in-out ${isDarkMode ? "bg-[#222b4b] text-white" : "bg-white text-black"}`}
    >
      <header
        className={`sticky top-0 z-50 w-full border-b ${isDarkMode ? "bg-[#01152b]" : "bg-[#faf6eb]"} backdrop-blur supports-[backdrop-filter]:bg-opacity-95`}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={isDarkMode ? "/logo2.png" : "/logo1.png"}
              alt="Spotter Logo"
              width={42}
              height={42}
              className="h-16 w-16"
            />
            <span className="text-xl font-bold">Spotter</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/UserPage" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Inicio
            </Link>
            <Link href="/match" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Match
            </Link>
            <Link href="/Psettings" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Perfil
            </Link>
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          </div>
          <button className="md:hidden flex items-center" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden flex flex-col items-center gap-4 p-4 bg-background">
            <Link href="/UserPage" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Inicio
            </Link>
            <Link href="/match" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Match
            </Link>
            <Link href="/Psettings" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Perfil
            </Link>
            <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          </div>
        )}
      </header>

      <main className="flex-1 container py-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">Ejercicios Recomendados</h2>
            <div className="flex items-center gap-2">
              <Select value={muscleFilter} onValueChange={setMuscleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los ejercicios</SelectItem>
                  <SelectItem value="pecho">Pecho</SelectItem>
                  <SelectItem value="espalda">Espalda</SelectItem>
                  <SelectItem value="piernas">Piernas</SelectItem>
                  <SelectItem value="brazos">Brazos</SelectItem>
                  <SelectItem value="hombros">Hombros</SelectItem>
                  <SelectItem value="core">Core</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="discover" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="discover">Descubrir</TabsTrigger>
              <TabsTrigger value="saved">Guardados ({savedExercises.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="discover" className="space-y-6">
              {filteredExercises.length === 0 ? (
                <div className="text-center py-12">
                  <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No hay ejercicios para esta categoría</h3>
                  <p className="text-muted-foreground">Prueba con otra categoría de ejercicios</p>
                </div>
              ) : (
                <Card className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={filteredExercises[currentExercise]?.image || "/placeholder.svg"}
                      alt={filteredExercises[currentExercise]?.name || "Ejercicio"}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-xl font-bold text-white">
                        {filteredExercises[currentExercise]?.name || "Ejercicio"}
                      </h3>
                      <div className="flex items-center gap-2 text-white/80 text-sm">
                        <span className="bg-rose-600/80 px-2 py-0.5 rounded-full">
                          {filteredExercises[currentExercise]?.category || ""}
                        </span>
                        <span className="bg-gray-600/80 px-2 py-0.5 rounded-full">
                          {filteredExercises[currentExercise]?.difficulty || ""}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4">
                      {filteredExercises[currentExercise]?.description || ""}
                    </p>

                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Músculos trabajados:</h4>
                      <div className="flex flex-wrap gap-2">
                        {filteredExercises[currentExercise]?.muscles.map((muscle, index) => (
                          <span key={index} className="bg-rose-100 text-rose-700 px-2 py-1 rounded-full text-xs">
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Pasos:</h4>
                      <ol className="list-decimal pl-5 space-y-1">
                        {filteredExercises[currentExercise]?.steps.map((step, index) => (
                          <li key={index} className="text-sm">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="flex justify-between items-center mt-6">
                      <Button variant="outline" size="icon" onClick={prevExercise} disabled={currentExercise === 0}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      <Button
                        variant={
                          savedExercises.includes(filteredExercises[currentExercise]?.id || 0) ? "default" : "outline"
                        }
                        className={
                          savedExercises.includes(filteredExercises[currentExercise]?.id || 0)
                            ? "bg-rose-600 hover:bg-rose-700"
                            : ""
                        }
                        onClick={() =>
                          filteredExercises[currentExercise] &&
                          toggleSaveExercise(filteredExercises[currentExercise].id)
                        }
                        disabled={!filteredExercises.length}
                      >
                        <Heart
                          className={`h-4 w-4 mr-2 ${savedExercises.includes(filteredExercises[currentExercise]?.id || 0) ? "fill-current" : ""}`}
                        />
                        {savedExercises.includes(filteredExercises[currentExercise]?.id || 0) ? "Guardado" : "Guardar"}
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={nextExercise}
                        disabled={currentExercise === filteredExercises.length - 1 || filteredExercises.length === 0}
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
                  {exercisesData
                    .filter((exercise) => savedExercises.includes(exercise.id))
                    .map((exercise) => (
                      <Card key={exercise.id} className="overflow-hidden">
                        <div className="relative">
                          <img
                            src={exercise.image || "/placeholder.svg"}
                            alt={exercise.name}
                            className="w-full h-40 object-cover"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                            onClick={() => toggleSaveExercise(exercise.id)}
                          >
                            <Heart className="h-4 w-4 fill-rose-600 text-rose-600" />
                          </Button>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold">{exercise.name}</h3>
                          <div className="flex items-center gap-2 text-xs mt-1 mb-2">
                            <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                              {exercise.category}
                            </span>
                            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                              {exercise.difficulty}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{exercise.description}</p>
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
