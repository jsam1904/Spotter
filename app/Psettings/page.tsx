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
import API from "@/lib/api"
import Swal from "sweetalert2"
import { Navbar } from "../../components/ui/Navbar"
import LoadingSpinner from "../../components/loading-spinner"

export default function ProfileSettings() {
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/150?text=User")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    gender: "",
    age: "",
    user_type: "",
    prof_pic: "",
    about_pics: [],
    bio: "",
    gym: ""
  })
  const [originalUserData, setOriginalUserData] = useState(userData)
  const [gyms, setGyms] = useState<{ id: string; name: string }[]>([])
  const [actualGym, setActualGym] = useState({ name: "" })
  const [originalGym, setOriginalGym] = useState(actualGym)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const getUserEmail = () => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        return payload.email
      } catch (e) {
        console.error("Error decoding token:", e)
        return null
      }
    }
    return null
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Swal.fire("Campos vacíos", "Por favor, llena todos los campos.", "warning")
      return
    }

    if (newPassword !== confirmPassword) {
      Swal.fire("Error", "Las nuevas contraseñas no coinciden.", "error")
      return
    }

    try {
      const res = await API.updateAndVerifyPassword(userData.email, currentPassword, newPassword)

      if (res.success) {
        Swal.fire("Éxito", res.message, "success")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        Swal.fire("Error", res.message || "No se pudo cambiar la contraseña", "error")
      }
    } catch (err) {
      console.error("Error en handleChangePassword:", err)
      Swal.fire("Error", "Contraseña actual incorrecta.", "error")
    }
  }

  const handleProfilePicUpload = async (file: File) => {
    const email = getUserEmail()
    if (!email) {
      Swal.fire("Error", "No se pudo obtener el correo del usuario.", "error")
      return
    }

    const formData = new FormData()
    formData.append("image", file)

    try {
      const response = await fetch(`http://localhost:3000/users/add-prof-pic/${email}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      })

      const result = await response.json()
      if (response.ok) {
        setUserData((prev) => ({ ...prev, prof_pic: result.prof_pic }))
        setProfileImage(result.prof_pic)
        Swal.fire("Éxito", "Foto de perfil actualizada correctamente.", "success")
      } else {
        Swal.fire("Error", result.error || "No se pudo actualizar la foto de perfil.", "error")
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error)
      Swal.fire("Error", "Error al subir la foto de perfil.", "error")
    }
  }

  const handleAboutPicsUpload = async (files: FileList) => {
    const email = getUserEmail()
    if (!email) {
      Swal.fire("Error", "No se pudo obtener el correo del usuario.", "error")
      return
    }

    const formData = new FormData()
    Array.from(files).forEach((file) => formData.append("images", file))

    try {
      const response = await fetch(`http://localhost:3000/users/add-about-pics/${email}`, {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      if (response.ok) {
        setUserData((prev) => ({ ...prev, about_pics: result.about_pics }))
        Swal.fire("Éxito", "Imágenes adicionales subidas correctamente.", "success")
      } else {
        Swal.fire("Error", result.error || "No se pudieron subir las imágenes adicionales.", "error")
      }
    } catch (error) {
      console.error("Error uploading about pictures:", error)
      Swal.fire("Error", "Error al subir las imágenes adicionales.", "error")
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = getUserEmail()
        console.log("Email obtenido:", email)

        if (!email) {
          console.error("Email no encontrado")
          return
        }

        const res = await API.getUserByEmail(email)
        console.log("Respuesta de API.getUserByEmail:", res)

        if (!res || Object.keys(res).length === 0) {
          console.error("No se encontraron datos de usuario")
          return
        }

        setUserData({
          name: res[0].name || "",
          username: res[0].username || "",
          gender: res[0].gender || "",
          age: res[0].age?.toString() || "",
          user_type: res[0].user_type || "",
          prof_pic: res[0].prof_pic || "",
          about_pics: res[0].about_pics || [],
          bio: res[0].bio || "",
          email: res[0].email || "",
          gym: ""
        })

        setOriginalUserData({
          name: res[0].name || "",
          username: res[0].username || "",
          gender: res[0].gender || "",
          age: res[0].age?.toString() || "",
          user_type: res[0].user_type || "",
          prof_pic: res[0].prof_pic || "",
          about_pics: res[0].about_pics || [],
          bio: res[0].bio || "",
          email: res[0].email || "",
          gym: ""
        })

        setProfileImage(res[0].prof_pic || "https://via.placeholder.com/150?text=User")
      } catch (error) {
        console.error("Error al obtener datos de usuario:", error)
      }
    }

    const fetchGyms = async () => {
      try {
        const res = await API.getGyms()
        console.log("Respuesta de API.getGyms:", res)

        if (!res || Object.keys(res).length === 0) {
          console.error("No se encontraron datos")
          return
        }

        setGyms(res)
        setOriginalGym(res)
      } catch (error) {
        console.error("Error al obtener datos de usuario:", error)
      }
    }

    const fetchActualGym = async () => {
      try {
        const res = await API.getActualGym(getUserEmail())
        console.log("Respuesta de API.getActualGym:", res)

        if (!res || Object.keys(res).length === 0) {
          console.error("No se encontraron datos")
          return
        }

        setUserData((prev) => ({
          ...prev,
          gym: res[0].name
        }))

        setActualGym({
          name: res[0].name
        })
      } catch (error) {
        console.error("Error al obtener datos de usuario:", error)
      }
    }

    fetchActualGym()
    fetchGyms()
    fetchUserData()
  }, [])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log(userData)
    const storedTheme = localStorage.getItem("theme")
    if (storedTheme === "dark") {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }

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

  const handleCancel = () => {
    setUserData(originalUserData)
    setActualGym(originalGym)
    setProfileImage(originalUserData.prof_pic || "https://via.placeholder.com/150?text=User")

    Swal.fire({
      icon: "info",
      title: "Cambios descartados",
      text: "Los datos han sido restaurados a su estado original.",
      confirmButtonColor: "#ef4444"
    })
  }

  const handleSave = async () => {
    try {
      await API.updateUser(userData.email, userData)
      await API.changeGym(userData.email, { name: userData.gym })

      setOriginalUserData(userData)
      setOriginalGym({ name: gyms.find((g) => g.id === userData.gym)?.name || "" })

      Swal.fire({
        icon: "success",
        title: "Cambios guardados",
        text: "Tu información ha sido actualizada correctamente.",
        confirmButtonColor: "#ef4444"
      })
    } catch (error) {
      console.error("Error al guardar cambios:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron guardar los cambios. Intenta nuevamente.",
        confirmButtonColor: "#ef4444"
      })
    }
  }

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
    )
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
              <TabsList className="w-full grid grid-cols-2 min-w-[500px]">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Perfil</span>
                </TabsTrigger>
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Cuenta</span>
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
                        src={profileImage}
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
                            handleProfilePicUpload(file)
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
                          onClick={() => {
                            setProfileImage("https://via.placeholder.com/150?text=User")
                            setUserData((prev) => ({ ...prev, prof_pic: "" }))
                          }}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Fotos Adicionales</h3>
                    <p className="text-sm text-muted-foreground">Agrega hasta 5 fotos para mostrar más sobre ti. JPG, GIF o PNG. Máximo 2MB cada una.</p>
                    <div className="flex flex-wrap gap-4">
                      {userData.about_pics.map((pic, index) => (
                        <div key={index} className="relative">
                          <img
                            src={pic}
                            alt={`Foto adicional ${index + 1}`}
                            className="w-24 h-24 rounded-md object-cover"
                          />
                          <button
                            className="absolute top-0 right-0 bg-rose-600 text-white p-1 rounded-full"
                            onClick={() => {
                              setUserData((prev) => ({
                                ...prev,
                                about_pics: prev.about_pics.filter((_, i) => i !== index)
                              }))
                            }}
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        id="about-pics"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = e.target.files
                          if (files && files.length > 0) {
                            if (userData.about_pics.length + files.length > 5) {
                              Swal.fire("Límite excedido", "Solo puedes subir hasta 5 fotos adicionales.", "warning")
                              return
                            }
                            handleAboutPicsUpload(files)
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById("about-pics")?.click()}
                      >
                        Agregar Fotos
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        type="text"
                        value={userData.name}
                        onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
                        className="input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Nombre de usuario</Label>
                      <Input
                        id="username"
                        value={userData?.username}
                        onChange={(e) => setUserData((prev) => ({ ...prev, username: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userData?.email}
                        onChange={(e) => setUserData((prev) => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Edad</Label>
                      <Input
                        id="age"
                        value={userData?.age}
                        onChange={(e) => setUserData((prev) => ({ ...prev, age: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bio">Biografía</Label>
                      <Textarea
                        id="bio"
                        placeholder="Cuéntanos sobre ti..."
                        value={userData?.bio}
                        onChange={(e) => setUserData((prev) => ({ ...prev, bio: e.target.value }))}
                        className="min-h-[100px] resize-y"
                      />
                      <p className="text-xs text-muted-foreground">
                        Esta información será visible para otros usuarios.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gym">Ubicación</Label>
                        <p>Gimnasio seleccionado: {userData.gym}</p>
                        <Select
                          value={userData.gym}
                          onValueChange={(value) =>
                            setUserData((prev) => ({ ...prev, gym: value }))
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona un gimnasio" />
                          </SelectTrigger>
                          <SelectContent>
                            {gyms?.map((gym) => (
                              <SelectItem key={gym.name} value={gym.name}>
                                {gym.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                  <Button variant="outline" className="w-full sm:w-auto" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button className="bg-rose-600 hover:bg-rose-700 w-full sm:w-auto mt-2 sm:mt-0" onClick={handleSave}>
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
                        <Input
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Nueva contraseña</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                  <Button className="bg-rose-600 hover:bg-rose-700 w-full sm:w-auto mt-2 sm:mt-0" onClick={handleChangePassword}>
                    Cambiar contraseña
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