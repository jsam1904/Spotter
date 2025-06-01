"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs"
import { Textarea } from "../../components/ui/textarea"
import { Switch } from "../../components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Camera, User, Bell, Shield, LogOut, Sun, Moon, Menu } from "lucide-react"
import { DarkModeToggle } from "../../components/ui/DarkModeToggle"
import { Navbar } from "../../components/ui/Navbar"
import LoadingSpinner from "../../components/loading-spinner"

export default function ProfileSettings() {
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/150?text=User")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme")
    if (storedTheme === "dark") {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }
    // Simula carga de datos
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
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

  // Links para la navbar
  const links = [
    { href: "/UserPage", label: "Inicio" },
    { href: "/match", label: "Match" },
    { href: "/recomendation", label: "Recomendaciones" },
    { href: "/Psettings", label: "Perfil" },
  ]

    if (loading) {
      return (
        <div>
          <LoadingSpinner />
        </div>
      );
    }

  return (
    <div
      className={`flex min-h-screen flex-col transition duration-700 ease-in-out ${isDarkMode ? "bg-[#222b4b] text-white" : "bg-white text-black"}`}
    >
      <Navbar
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        links={links}
      />
      <main className="flex-1 container py-6 px-4 md:px-6">
        <div className="space-y-6 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold">Configuración de Perfil</h2>

          <Tabs defaultValue="profile" className="w-full">
            <div className="overflow-x-auto pb-2">
              <TabsList className="w-full grid grid-cols-4 min-w-[500px]">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Perfil</span>
                </TabsTrigger>
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Cuenta</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span>Notificaciones</span>
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  <span>Privacidad</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="profile" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>Actualiza tu información personal y cómo te ven otros usuarios</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                    <div className="relative">
                      <img
                        src={profileImage || "/placeholder.svg"}
                        alt="Foto de perfil"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                      <label
                        htmlFor="profile-image"
                        className="absolute bottom-0 right-0 bg-rose-600 text-white p-1 rounded-full cursor-pointer"
                      >
                        <Camera className="h-4 w-4" />
                      </label>
                      <input
                        id="profile-image"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (e) => {
                              if (e.target?.result) {
                                setProfileImage(e.target.result as string)
                              }
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="font-medium">Foto de Perfil</h3>
                      <p className="text-sm text-muted-foreground">JPG, GIF o PNG. Máximo 2MB.</p>
                      <div className="flex gap-2 mt-2 justify-center sm:justify-start">
                        <Button variant="outline" size="sm" asChild>
                          <label htmlFor="profile-image" className="cursor-pointer">
                            Cambiar
                          </label>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setProfileImage("https://via.placeholder.com/150?text=User")}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre</Label>
                      <Input id="name" defaultValue="Carlos Rodríguez" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Nombre de usuario</Label>
                      <Input id="username" defaultValue="carlos_fitness" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="carlos@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" type="tel" defaultValue="+34 612 345 678" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bio">Biografía</Label>
                      <Textarea
                        id="bio"
                        placeholder="Cuéntanos sobre ti..."
                        defaultValue="Apasionado del fitness y la vida saludable. Entreno 4 veces por semana y busco compañeros para motivarnos mutuamente."
                        className="min-h-[100px] resize-y"
                      />
                      <p className="text-xs text-muted-foreground">
                        Esta información será visible para otros usuarios.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Preferencias de entrenamiento</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="experience">Nivel de experiencia</Label>
                        <Select defaultValue="intermediate">
                          <SelectTrigger id="experience" className="w-full">
                            <SelectValue placeholder="Selecciona tu nivel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Principiante</SelectItem>
                            <SelectItem value="intermediate">Intermedio</SelectItem>
                            <SelectItem value="advanced">Avanzado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="goals">Objetivos principales</Label>
                        <Select defaultValue="muscle">
                          <SelectTrigger id="goals" className="w-full">
                            <SelectValue placeholder="Selecciona tu objetivo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="muscle">Ganar músculo</SelectItem>
                            <SelectItem value="weight">Perder peso</SelectItem>
                            <SelectItem value="strength">Fuerza</SelectItem>
                            <SelectItem value="tone">Tonificar</SelectItem>
                            <SelectItem value="endurance">Resistencia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="schedule">Horario preferido</Label>
                        <Select defaultValue="evening">
                          <SelectTrigger id="schedule" className="w-full">
                            <SelectValue placeholder="Selecciona tu horario" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Mañanas</SelectItem>
                            <SelectItem value="afternoon">Tardes</SelectItem>
                            <SelectItem value="evening">Noches</SelectItem>
                            <SelectItem value="weekend">Fines de semana</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Ubicación</Label>
                        <Input id="location" defaultValue="Madrid, España" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Cancelar
                  </Button>
                  <Button className="bg-rose-600 hover:bg-rose-700 w-full sm:w-auto mt-2 sm:mt-0">
                    Guardar cambios
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Seguridad de la cuenta</CardTitle>
                  <CardDescription>Actualiza tu contraseña y configura la seguridad de tu cuenta</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Cambiar contraseña</h3>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Contraseña actual</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Nueva contraseña</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Verificación en dos pasos</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Autenticación de dos factores</p>
                        <p className="text-sm text-muted-foreground">Añade una capa extra de seguridad a tu cuenta</p>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Sesiones activas</h3>
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                          <p className="font-medium">iPhone 13 - Madrid, España</p>
                          <p className="text-xs text-muted-foreground">Activo ahora • Safari</p>
                        </div>
                        <Button variant="outline" size="sm" className="mt-1 sm:mt-0">
                          Este dispositivo
                        </Button>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                          <p className="font-medium">MacBook Pro - Madrid, España</p>
                          <p className="text-xs text-muted-foreground">Hace 2 días • Chrome</p>
                        </div>
                        <Button variant="outline" size="sm" className="mt-1 sm:mt-0">
                          Cerrar sesión
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Cancelar
                  </Button>
                  <Button className="bg-rose-600 hover:bg-rose-700 w-full sm:w-auto mt-2 sm:mt-0">
                    Guardar cambios
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preferencias de notificaciones</CardTitle>
                  <CardDescription>Configura cómo y cuándo quieres recibir notificaciones</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Notificaciones por email</h3>
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                          <p className="font-medium">Mensajes nuevos</p>
                          <p className="text-sm text-muted-foreground">
                            Recibe un email cuando alguien te envía un mensaje
                          </p>
                        </div>
                        <Switch defaultChecked className="mt-1 sm:mt-0" />
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                          <p className="font-medium">Nuevos matches</p>
                          <p className="text-sm text-muted-foreground">
                            Recibe un email cuando encuentras un nuevo match
                          </p>
                        </div>
                        <Switch defaultChecked className="mt-1 sm:mt-0" />
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                          <p className="font-medium">Actualizaciones de la plataforma</p>
                          <p className="text-sm text-muted-foreground">
                            Recibe emails sobre nuevas funcionalidades y actualizaciones
                          </p>
                        </div>
                        <Switch className="mt-1 sm:mt-0" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Notificaciones push</h3>
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                          <p className="font-medium">Mensajes</p>
                          <p className="text-sm text-muted-foreground">
                            Recibe notificaciones cuando alguien te envía un mensaje
                          </p>
                        </div>
                        <Switch defaultChecked className="mt-1 sm:mt-0" />
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                          <p className="font-medium">Matches</p>
                          <p className="text-sm text-muted-foreground">Recibe notificaciones sobre nuevos matches</p>
                        </div>
                        <Switch defaultChecked className="mt-1 sm:mt-0" />
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                          <p className="font-medium">Recordatorios de entrenamiento</p>
                          <p className="text-sm text-muted-foreground">
                            Recibe recordatorios para tus sesiones de entrenamiento
                          </p>
                        </div>
                        <Switch defaultChecked className="mt-1 sm:mt-0" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Cancelar
                  </Button>
                  <Button className="bg-rose-600 hover:bg-rose-700 w-full sm:w-auto mt-2 sm:mt-0">
                    Guardar cambios
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacidad y datos</CardTitle>
                  <CardDescription>Gestiona tu privacidad y la información que compartes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Visibilidad del perfil</h3>
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                          <p className="font-medium">Perfil público</p>
                          <p className="text-sm text-muted-foreground">
                            Tu perfil será visible para otros usuarios de Spotter
                          </p>
                        </div>
                        <Switch defaultChecked className="mt-1 sm:mt-0" />
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                          <p className="font-medium">Mostrar ubicación</p>
                          <p className="text-sm text-muted-foreground">
                            Permite que otros usuarios vean tu ubicación aproximada
                          </p>
                        </div>
                        <Switch defaultChecked className="mt-1 sm:mt-0" />
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                          <p className="font-medium">Mostrar estado de actividad</p>
                          <p className="text-sm text-muted-foreground">
                            Muestra cuándo estás en línea o tu última conexión
                          </p>
                        </div>
                        <Switch defaultChecked className="mt-1 sm:mt-0" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Datos y privacidad</h3>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        Descargar mis datos
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Eliminar mi cuenta
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Al eliminar tu cuenta, todos tus datos serán eliminados permanentemente y no podrán ser
                      recuperados.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Cancelar
                  </Button>
                  <Button className="bg-rose-600 hover:bg-rose-700 w-full sm:w-auto mt-2 sm:mt-0">
                    Guardar cambios
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
