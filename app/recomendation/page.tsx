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
import { Dialog } from "@headlessui/react";
import { Check, Settings } from "lucide-react";
import API from "@/lib/api"
import Swal from "sweetalert2";

interface Exercise {
  img: string
  name: string
  description: string
}

const preferencesList = [
  "Notificaciones por correo",
  "Modo oscuro",
  "Recordatorios diarios",
  "Actualizaciones del sistema",
  "Ofertas personalizadas",
];
type Preference = {
  id: string;
  name: string;
};

export default function ExerciseRecommendations() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("isDarkMode")
      return stored === "true"
    }
    return false
  })
  const [currentExercise, setCurrentExercise] = useState(0)
  const [savedExercises, setSavedExercises] = useState<number[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [preferencesList, setPreferencesList] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<Preference[]>([]);

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

  const togglePreference = (pref: string) => {
    setSelectedPrefs(prev =>
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

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
  useEffect(() => {

    fetchExercises()
  }, [])

  useEffect(() => {
    if (isOpen) {
      API.getPreferences()
        .then((prefs: Preference[]) => {
          setPreferences(prefs);
          setSelectedPrefs([]); // opcional
        })
        .catch((err) => console.error("Error al cargar preferencias:", err));
    }
  }, [isOpen]);


  const links = [
    { href: "/UserPage", label: "Inicio" },
    { href: "/match", label: "Match" },
    { href: "/Psettings", label: "Perfil" },
  ]

  const handleSave = async () => {
    const email = getEmailFromToken();
    if (!email) {
      Swal.fire("Error", "No se pudo obtener el email del token", "error");
      return;
    }

    try {
      const res = await API.updateUserPreferences(email, selectedPrefs);
      console.log("Respuesta:", res);

      if (res.status < 200 || res.status >= 300) {
        throw new Error("Respuesta no exitosa");
      }


      Swal.fire("Éxito", "Preferencias guardadas correctamente", "success");
      setIsOpen(false);
      fetchExercises();
    } catch (err) {
      console.error("Error al guardar preferencias:", err);
      Swal.fire("Error", "No se pudieron guardar las preferencias", "error");
    }
  };




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
      <Navbar
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        links={links}
      />
      <main className="flex-1 container py-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">Ejercicios Recomendados</h2>
            {/* Botón flotante */}
            <Button
              className="fixed bottom-4 right-4 rounded-full shadow-lg p-3 bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsOpen(true)}
            >Editar mis preferencias
              <Settings className="w-5 h-5 text-white" />
            </Button>
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
          {/* Modal */}
          <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed z-50 inset-0">
            <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-40">
              <Dialog.Panel className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-md">
                <Dialog.Title className="text-xl font-bold mb-4">Selecciona tus preferencias</Dialog.Title>
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {preferences.map((pref) => (
                    <label key={pref.id} className="block">
                      <input
                        type="checkbox"
                        value={pref.name}
                        checked={selectedPrefs.includes(pref.name)}
                        onChange={(e) =>
                          setSelectedPrefs(prev =>
                            e.target.checked
                              ? [...prev, pref.name]
                              : prev.filter(p => p !== pref.name)
                          )
                        }
                      />{" "}
                      {pref.name}
                    </label>
                  ))}


                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
                  <Button onClick={handleSave}>
                    <Check className="w-4 h-4 mr-1" />
                    Guardar preferencias
                  </Button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </div>
      </main>
    </div>
  )
}

