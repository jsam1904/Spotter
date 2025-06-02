'use client'
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Dumbbell, Users, Search, Menu, Sun, Moon, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import L, { LatLngExpression } from 'leaflet'
import { useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { DarkModeToggle } from "@/components/ui/DarkModeToggle"
import { Navbar } from "@/components/ui/Navbar"
import  LoadingSpinner from "@/components/loading-spinner";

// Icono naranja para gimnasios
const orangeIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 32 48"><path fill="#e6790c" stroke="#fff" stroke-width="3" d="M16 2C8.268 2 2 8.268 2 16c0 10.493 12.07 28.01 12.595 28.77a2 2 0 0 0 3.21 0C17.93 44.01 30 26.493 30 16c0-7.732-6.268-14-14-14zm0 20a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"/></svg>`),
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [13, 41],
})

// Icono rojo para sugerencia
const redIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 32 48"><path fill="#e3342f" stroke="#fff" stroke-width="3" d="M16 2C8.268 2 2 8.268 2 16c0 10.493 12.07 28.01 12.595 28.77a2 2 0 0 0 3.21 0C17.93 44.01 30 26.493 30 16c0-7.732-6.268-14-14-14zm0 20a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"/></svg>`),
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [13, 41],
})

// Define gym interface for type safety
interface Gym {
  gymId: string
  latitude: number
  longitude: number
  name: string
  description: string
  verified: boolean
}

// Dynamic imports for react-leaflet components
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false })

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<{ name?: string, email?:string} | null>(null)
  const [gyms, setGyms] = useState<Gym[]>([])
  const [suggestForm, setSuggestForm] = useState({ name: "", description: "", latitude: "", longitude: "" })
  const [suggestMsg, setSuggestMsg] = useState("")
  const [suggestMarker, setSuggestMarker] = useState<{ lat: number; lng: number } | null>(null)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  // Load dark mode preference and user data from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme")

    try {
      const tokenData = localStorage.getItem("token")
      if (tokenData) {
        const base64Url = tokenData.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            })
            .join('')
        )
        const userObj = JSON.parse(jsonPayload)
        setUser(userObj)
      } else {
        router.push('/login')
      }
    } catch (err) {
      console.error("Error decoding token:", err)
      router.push('/login')
    }

    if (storedTheme === "dark") {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }

    // Fetch gyms
    setLoading(true);
    fetch("http://localhost:3000/gym/verified")
      .then(res => res.json())
      .then(setGyms)
      .catch(() => setGyms([]))
      .finally(() => setLoading(false));
  }, [router])

  // Toggle dark mode
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

  // Handle gym suggestion form submission
  const handleSuggestGym = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuggestMsg("")
    try {
      const res = await fetch("http://localhost:3000/gym/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: suggestForm.name,
          description: suggestForm.description,
          latitude: parseFloat(suggestForm.latitude),
          longitude: parseFloat(suggestForm.longitude)
        })
      })
      if (res.ok) {
        setSuggestMsg("¡Gimnasio sugerido exitosamente!")
        setSuggestForm({ name: "", description: "", latitude: "", longitude: "" })
        formRef.current?.reset()
      } else {
        setSuggestMsg("Error al sugerir gimnasio.")
      }
    } catch {
      setSuggestMsg("Error de red.")
    }
  }

  // Componente para manejar el click en el mapa
  const SuggestionMarkerHandler = () => {
    const map = useMapEvents({
      click(e) {
        setSuggestMarker({ lat: e.latlng.lat, lng: e.latlng.lng })
        setSuggestForm(f => ({
          ...f,
          latitude: e.latlng.lat.toString(),
          longitude: e.latlng.lng.toString(),
        }))
      },
    })
    return null
  }

  function GymMarker({ gym, icon, user }: { gym: Gym, icon: L.Icon, user: { email?: string } | null }) {
    const [assignMsg, setAssignMsg] = useState<string | null>(null);

    const handleAssign = async () => {
      setAssignMsg(null);
      if (!user?.email) {
        setAssignMsg("No se encontró el email del usuario.");
        return;
      }
      try {
        const res = await fetch(`http://localhost:3000/gym/assign/${user.email}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gymId: gym.gymId }),
        });
        if (res.ok) {
          setAssignMsg("¡Te has asignado a este gimnasio!");
        } else {
          setAssignMsg("Error al asignar gimnasio.");
        }
      } catch {
        setAssignMsg("Error de red.");
      }
    };

    const lat = Number(gym.latitude);
    let lng = Number(gym.longitude);
    if (lng > 0) lng = -lng;

    return (
      <Marker
        key={gym.gymId}
        position={[lat, lng] as LatLngExpression}
        icon={icon}
      >
        <Popup>
          <b>{gym.name}</b>
          <br />
          {gym.description}
          <br />
          <Button
            className="mt-2 w-full bg-[#e6790c] text-white hover:bg-rose-700"
            onClick={handleAssign}
          >
            Asignarme a este gimnasio
          </Button>
          {assignMsg && (
            <div className="text-xs mt-1">{assignMsg}</div>
          )}
        </Popup>
      </Marker>
    );
  }

  // Componente para el listado de gimnasios con botón de asignar
  function GymListItem({ gym, user }: { gym: Gym, user: { email?: string } | null }) {
    const [assignMsg, setAssignMsg] = useState<string | null>(null);

    const handleAssign = async () => {
      setAssignMsg(null);
      if (!user?.email) {
        setAssignMsg("No se encontró el email del usuario.");
        return;
      }
      try {
        const res = await fetch(`http://localhost:3000/gym/assign/${user.email}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gymId: gym.gymId }),
        });
        if (res.ok) {
          setAssignMsg("¡Te has asignado a este gimnasio!");
        } else {
          setAssignMsg("Error al asignar gimnasio.");
        }
      } catch {
        setAssignMsg("Error de red.");
      }
    };

    return (
      <li className="p-3 rounded-lg border flex flex-col md:flex-row md:items-center md:justify-between bg-white/70 dark:bg-[#222b4b]/70">
        <div>
          <span className="font-semibold">{gym.name}</span>
          <span className="ml-2 text-xs text-gray-500">{gym.verified ? "Verificado" : "No verificado"}</span>
          <div className="text-xs">{gym.description}</div>
        </div>
        <div className="mt-2 md:mt-0 flex flex-col items-end gap-1">
          <span className="text-xs text-gray-400">Lat: {gym.latitude.toFixed(5)}, Lng: {gym.longitude.toFixed(5)}</span>
          <Button
            className="mt-1 bg-[#e6790c] text-white hover:bg-rose-700 px-3 py-1 text-xs"
            onClick={handleAssign}
          >
            Asignarme a este gimnasio
          </Button>
          {assignMsg && (
            <div className="text-xs mt-1">{assignMsg}</div>
          )}
        </div>
      </li>
    );
  }

  // Filtrar gimnasios por búsqueda
  const filteredGyms = gyms.filter(gym =>
    gym.name.toLowerCase().includes(search.toLowerCase()) ||
    gym.description.toLowerCase().includes(search.toLowerCase())
  )

  const links = [
    { href: "/", label: "Pagina de inicio" },
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
    <div className={`flex min-h-screen flex-col transition duration-700 ease-in-out ${isDarkMode ? "bg-[#222b4b] text-white" : "bg-white text-black"}`}>
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} links={links} />
      <main className="flex-1">
        <section className="w-full py-6 md:py-10 lg:py-14 xl:py-16">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Bienvenido {user ? `${user.name}` : "usuario"} a Spotter
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Esperamos que disfrutes de la experiencia de Spotter, donde puedes encontrar compañeros de entrenamiento,
                    encontrar recomendaciones personalizadas y mucho más.
                  </p>
                </div>
                <div>
                  <div className="flex flex-col sm:flex-row gap-4 mt-2">
                    <a href="/match">
                      <Button className={`hidden md:inline-flex ${isDarkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-[#e6790c] text-white hover:bg-rose-700"}`}>
                        Match
                      </Button>
                    </a>
                    <a href="/recomendation">
                      <Button className={`hidden md:inline-flex ${isDarkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-[#e6790c] text-white hover:bg-rose-700"}`}>
                        Recomendaciones
                      </Button>
                    </a>
                    <a href="/Psettings">
                      <Button className={`hidden md:inline-flex ${isDarkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-[#e6790c] text-white hover:bg-rose-700"}`}>
                        Editar Perfil
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
              <Image
                src="https://media.glamour.mx/photos/66149aeaf970b1eaac7c059f/master/w_1600%2Cc_limit/gym-partner.jpg"
                width={550}
                height={550}
                alt="Hero"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        {/* Mapa de gimnasios */}
        <section className="w-full py-8 md:py-12">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-4">Gimnasios en tu ciudad</h2>

            {/* Barra de búsqueda */}
            <div className="flex items-center gap-2 mb-6">
              <Input
                placeholder="Buscar gimnasio por nombre o descripción..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={`max-w-screen ${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
              />
              <Search className="text-[#e6790c]" />
            </div>

            {/* Listado de gimnasios filtrados */}
            {search.trim() !== "" && (
              <div className="mb-6">
                {filteredGyms.length === 0 ? (
                  <div className="text-sm text-gray-500">No se encontraron gimnasios.</div>
                ) : (
                  <ul className="space-y-2">
                    {filteredGyms.map(gym => (
                      <GymListItem key={gym.gymId} gym={gym} user={user} />
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Mapa de gimnasios */}
            <div className="w-full h-[600px] rounded-lg overflow-hidden mb-6 z-0 relative">
              {typeof window !== "undefined" && (
                <MapContainer
                  center={[14.634915, -90.506882] as LatLngExpression}
                  zoom={12}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <SuggestionMarkerHandler />
                  {filteredGyms.map(gym => (
                    <GymMarker key={gym.gymId} gym={gym} icon={orangeIcon} user={user} />
                  ))}
                  {suggestMarker && (
                    <Marker
                      position={[suggestMarker.lat, suggestMarker.lng]}
                      icon={redIcon}
                      draggable={true}
                      eventHandlers={{
                        dragend: (e) => {
                          const marker = e.target
                          const position = marker.getLatLng()
                          setSuggestMarker({ lat: position.lat, lng: position.lng })
                          setSuggestForm(f => ({
                            ...f,
                            latitude: position.lat.toString(),
                            longitude: position.lng.toString(),
                          }))
                        }
                      }}
                    >
                      <Popup>Ubicación sugerida</Popup>
                    </Marker>
                  )}
                </MapContainer>
              )}
            </div>

            <h3 className="text-xl font-semibold mb-2 text-center">¿No encuentras tu gimnasio? ¡Sugiere uno!</h3>
            <div className="flex justify-center">
              <form
                ref={formRef}
                className="flex flex-col gap-4 max-w-md w-full p-6 rounded-xl shadow-lg border bg-white/80 dark:bg-[#222b4b]/80"
                onSubmit={handleSuggestGym}
              >
                <div>
                  <label className="block text-sm font-semibold mb-1">Nombre del gimnasio</label>
                  <Input
                    placeholder="Ejemplo: SmartFit Cayalá"
                    required
                    value={suggestForm.name}
                    onChange={e => setSuggestForm(f => ({ ...f, name: e.target.value }))}
                    className={`${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Descripción</label>
                  <Input
                    placeholder="Describe el gimnasio"
                    required
                    value={suggestForm.description}
                    onChange={e => setSuggestForm(f => ({ ...f, description: e.target.value }))}
                    className={`${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Ubicación</label>
                  {suggestMarker ? (
                    <div className="text-xs text-green-700 dark:text-green-400">
                      Coordenadas seleccionadas: {suggestMarker.lat.toFixed(6)}, {suggestMarker.lng.toFixed(6)}
                    </div>
                  ) : (
                    <div className="text-xs text-rose-700 dark:text-rose-400">
                      Haz clic en el mapa para seleccionar la ubicación del gimnasio.
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  className={`${isDarkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-[#e6790c] text-white hover:bg-rose-700"} w-fit`}
                >
                  Sugerir gimnasio
                </Button>
                {suggestMsg && <span className="text-sm">{suggestMsg}</span>}
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}