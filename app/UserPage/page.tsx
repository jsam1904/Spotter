'use client'
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Dumbbell, Users, Search, Menu, Sun, Moon, Calendar } from "lucide-react"

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Load dark mode preference from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme")
    if (storedTheme === "dark") {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

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

  return (
    <div className={`flex min-h-screen flex-col transition duration-700 ease-in-out ${isDarkMode ? "bg-[#222b4b] text-white" : "bg-white text-black"}`}>
      <header    className={`sticky top-0 z-50 w-full border-b ${
          isDarkMode ? "bg-[#01152b]" : "bg-[#faf6eb]"
        } backdrop-blur supports-[backdrop-filter]:bg-opacity-95`}>
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
            <Link href="/" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Pagina de inicio
            </Link>
            <Link href="/match" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Match
            </Link>
            <Link href="/recomendation" className="text-sm font-medium transition-colors hover:text-foreground/80">
                Recomendaciones
            </Link>
            <Link href="/Psettings" className="text-sm font-medium transition-colors hover:text-foreground/80">
                Perfil
            </Link>
          </nav>
          <div className="hidden md:flex items-center gap-4">
          <div
            className={`relative flex items-center justify-between gap-2 p-1 px-0 rounded-full ${
              isDarkMode ? "bg-gray-700" : "bg-gray-300"
            } cursor-pointer w-14`} 
            onClick={toggleDarkMode}>
            <Sun className={`h-4 w-4 ml-2 ${!isDarkMode ? "text-[#e6790c]" : "text-gray-400"}`} />
            <Moon className={`h-4 w-4 mr-2 ${isDarkMode ? "text-blue-500" : "text-gray-400"}`} />
            <div
              className={`absolute w-8 h-6 rounded-full transition-transform ${
                isDarkMode
                  ? "translate-x-6 bg-gray-900/80" 
                  : "translate-x-0 bg-white/60" 
              } z-10`} 
            ></div>
          </div>
          </div>
          <button
            className="md:hidden flex items-center"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden flex flex-col items-center gap-4 p-4 bg-background">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Inicio
            </Link>
            <Link href="/recomendation" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Recomendaciones
            </Link>
            <Link href="match" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Match
            </Link>
            <Link href="/Psettings" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Perfil
            </Link>
            <div
            className={`relative flex items-center justify-between gap-2 p-1 px-0 rounded-full ${
              isDarkMode ? "bg-gray-700" : "bg-gray-300"
            } cursor-pointer w-14`} 
            onClick={toggleDarkMode}>
            <Sun className={`h-4 w-4 ml-2 ${!isDarkMode ? "text-[#e6790c]" : "text-gray-400"}`} />
            <Moon className={`h-4 w-4 mr-2 ${isDarkMode ? "text-blue-500" : "text-gray-400"}`} />
            <div
              className={`absolute w-8 h-6 rounded-full transition-transform ${
                isDarkMode
                  ? "translate-x-6 bg-gray-900/80"
                  : "translate-x-0 bg-white/60" 
              } z-10`} 
            ></div>
          </div>


          </div>
        )}
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Bienvenido "Si logran poner el nombre del usuario estaria de ahuevo JAJAJAJAJA" a Spotter
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Esperamos que disfrutes de la experiencia de Spotter, donde puedes encontrar compañeros de entrenamiento, 
                    encontrar recomendaciones personalizadas y mucho más.
                  </p>
                </div>
                <div>
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
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
                src="https://media.istockphoto.com/id/513434400/es/foto/bros-trabajar-conjuntamente-en-un-gimnasio.jpg?s=612x612&w=0&k=20&c=r3JSlTcklM39VysfJ0SnH9lEeslRTcPXMvP_MIdxXIA="
                width={550}
                height={550}
                alt="Hero"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        </main>
    </div>
  )
}
