
'use client';

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { MapPin, MessageSquare, Clock, X, Heart, Sun, Moon, Menu, Filter, ArrowLeft, ArrowRight } from "lucide-react";
import { Slider } from "../../components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { motion, type PanInfo, useMotionValue, useTransform } from "framer-motion";

const matchesData = [
  {
    id: 1,
    name: "Ana García",
    age: 28,
    gender: "Mujer",
    location: "Madrid, España",
    distance: 2.5,
    goals: ["Tonificar", "Perder peso"],
    schedule: ["Mañanas", "Fines de semana"],
    experience: "Intermedio",
    bio: "Entusiasta del fitness buscando compañeros para entrenar regularmente. Me encanta el entrenamiento de fuerza y el cardio HIIT.",
    image: "https://craftcms-assets.playbookapp.io/challenge/lean-beef-patty-new-years-challenge/_375x400_crop_center-center_none/LeanBeefPatty-Challenge-Challenge-Header-1.png",
    lastActive: "Hace 2 horas",
  },
  {
    id: 2,
    name: "Miguel Fernández",
    age: 32,
    gender: "Hombre",
    location: "Madrid, España",
    distance: 3.8,
    goals: ["Ganar músculo", "Fuerza"],
    schedule: ["Tardes", "Entre semana"],
    experience: "Avanzado",
    bio: "Powerlifter con 5 años de experiencia. Busco compañeros para sesiones de fuerza y técnica en los levantamientos básicos.",
    image: "https://i.pinimg.com/736x/bd/ff/50/bdff5034a461015aa147b7dd964f964c.jpg",
    lastActive: "Hace 30 minutos",
  },
  {
    id: 3,
    name: "Laura Martínez",
    age: 25,
    gender: "Mujer",
    location: "Madrid, España",
    distance: 1.2,
    goals: ["Flexibilidad", "Resistencia"],
    schedule: ["Mañanas", "Entre semana"],
    experience: "Principiante",
    bio: "Principiante en el mundo del fitness. Busco alguien que me pueda guiar y motivar en mis primeros pasos en el gimnasio.",
    image: "https://www.hola.com/horizon/landscape/acb938f01aa7-spinning-salud-t.jpg",
    lastActive: "Hace 1 día",
  },
  {
    id: 4,
    name: "Carlos Ruiz",
    age: 30,
    gender: "Hombre",
    location: "Madrid, España",
    distance: 4.5,
    goals: ["Ganar músculo", "Definición"],
    schedule: ["Noches", "Todos los días"],
    experience: "Intermedio",
    bio: "Apasionado del culturismo natural. Entreno 5 días a la semana y busco compañeros con objetivos similares para motivarnos mutuamente.",
    image: "https://www.sdpnoticias.com/resizer/v2/4GFIF2ENH5GVFIF6HSDERCOPPY.jpg?smart=true&auth=47ff9d46e0bf94be3d8d01b340aa8e46f848227e9266435fa206e2d8469cf39c&width=1440&height=1546",
    lastActive: "En línea ahora",
  },
  {
    id: 5,
    name: "Elena Sánchez",
    age: 27,
    gender: "Mujer",
    location: "Madrid, España",
    distance: 3.1,
    goals: ["Tonificar", "Yoga"],
    schedule: ["Tardes", "Fines de semana"],
    experience: "Intermedio",
    bio: "Instructora de yoga y entusiasta del fitness. Busco compañeros para entrenamientos variados y sesiones de yoga.",
    image: "https://i.pinimg.com/originals/11/6f/17/116f17eab227934e5ebcacb1a024367a.jpg",
    lastActive: "Hace 3 horas",
  },
];

const conversationsData = [
  {
    id: 1,
    user: {
      id: 1,
      name: "Ana García",
      image: "https://via.placeholder.com/150?text=Ana",
    },
    lastMessage: "¿Te parece bien quedar mañana a las 18:00 en el gimnasio?",
    timestamp: "10:30",
    unread: true,
  },
  {
    id: 2,
    user: {
      id: 2,
      name: "Miguel Fernández",
      image: "https://via.placeholder.com/150?text=Miguel",
    },
    lastMessage: "Gracias por los consejos sobre la técnica de sentadilla.",
    timestamp: "Ayer",
    unread: false,
  },
];

export default function FindMatches() {
  const [ageRange, setAgeRange] = useState([18, 80]);
  const [gender, setGender] = useState("Todos");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState(matchesData);
  const [likedProfiles, setLikedProfiles] = useState<number[]>([]);
  const [dislikedProfiles, setDislikedProfiles] = useState<number[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filtrar matches según edad y género
  useEffect(() => {
    const filteredMatches = matchesData.filter(
      (match) =>
        match.age >= ageRange[0] &&
        match.age <= ageRange[1] &&
        (gender === "Todos" || match.gender === gender)
    );
    setMatches(filteredMatches);
    setCurrentIndex(0); // Reiniciar al cambiar filtros
  }, [ageRange, gender]);

  // Manejo del tema oscuro
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Animaciones de deslizamiento
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSwipe = (info: PanInfo) => {
    if (info.offset.x > 100) {
      x.set(200);
      setTimeout(() => {
        likeProfile();
      }, 100);
    } else if (info.offset.x < -100) {
      x.set(-200);
      setTimeout(() => {
        dislikeProfile();
      }, 100);
    } else {
      x.set(0);
    }
  };

  const likeProfile = () => {
    if (currentIndex < matches.length) {
      x.set(200);
      setTimeout(() => {
        setLikedProfiles([...likedProfiles, matches[currentIndex].id]);
        setCurrentIndex(currentIndex + 1);
        x.set(0);
      }, 200);
    }
  };

  const dislikeProfile = () => {
    if (currentIndex < matches.length) {
      x.set(-200);
      setTimeout(() => {
        setDislikedProfiles([...dislikedProfiles, matches[currentIndex].id]);
        setCurrentIndex(currentIndex + 1);
        x.set(0);
      }, 200);
    }
  };

  const resetCards = () => {
    setCurrentIndex(0);
    setLikedProfiles([]);
    setDislikedProfiles([]);
    setMatches(matchesData);
  };

  return (
    <div
      className={`flex min-h-screen flex-col transition duration-700 ease-in-out ${
        isDarkMode ? "bg-[#222b4b] text-white" : "bg-white text-black"
      }`}
    >
      <header
        className={`sticky top-0 z-50 w-full border-b ${
          isDarkMode ? "bg-[#01152b]" : "bg-[#faf6eb]"
        } backdrop-blur supports-[backdrop-filter]:bg-opacity-95`}
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
          <nav className="hidden md:flex gap-6 items-center">
            <Link href="/UserPage" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Inicio
            </Link>
            <Link href="/UserPage?tab=discover" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Descubrir
            </Link>
            <Link href="/UserPage?tab=messages" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Mensajes ({conversationsData.length})
            </Link>
            <Link href="/Psettings" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Perfil
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <div
              className={`relative flex items-center justify-between gap-2 p-1 px-0 rounded-full ${
                isDarkMode ? "bg-gray-700" : "bg-gray-300"
              } cursor-pointer w-14`}
              onClick={toggleDarkMode}
            >
              <Sun className={`h-4 w-4 ml-2 ${!isDarkMode ? "text-[#e6790c]" : "text-gray-400"}`} />
              <Moon className={`h-4 w-4 mr-2 ${isDarkMode ? "text-blue-500" : "text-gray-400"}`} />
              <div
                className={`absolute w-8 h-6 rounded-full transition-transform ${
                  isDarkMode ? "translate-x-6 bg-gray-900/80" : "translate-x-0 bg-white/60"
                } z-10`}
              ></div>
            </div>
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
            <Link href="/UserPage?tab=discover" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Descubrir
            </Link>
            <Link href="/UserPage?tab=messages" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Mensajes ({conversationsData.length})
            </Link>
            <Link href="/Psettings" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Perfil
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <div
              className={`relative flex items-center justify-between gap-2 p-1 px-0 rounded-full ${
                isDarkMode ? "bg-gray-700" : "bg-gray-300"
              } cursor-pointer w-14`}
              onClick={toggleDarkMode}
            >
              <Sun className={`h-4 w-4 ml-2 ${!isDarkMode ? "text-[#e6790c]" : "text-gray-400"}`} />
              <Moon className={`h-4 w-4 mr-2 ${isDarkMode ? "text-blue-500" : "text-gray-400"}`} />
              <div
                className={`absolute w-8 h-6 rounded-full transition-transform ${
                  isDarkMode ? "translate-x-6 bg-gray-900/80" : "translate-x-0 bg-white/60"
                } z-10`}
              ></div>
            </div>
          </div>
        )}
        {filtersOpen && (
          <div className="md:hidden flex flex-col items-center gap-4 p-4 bg-background border-t">
            <div className="w-full max-w-xs space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Rango de edad: {ageRange[0]} - {ageRange[1]} años</label>
                <Slider
                  defaultValue={[18, 80]}
                  min={18}
                  max={80}
                  step={1}
                  value={ageRange}
                  onValueChange={setAgeRange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Género</label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos</SelectItem>
                    <SelectItem value="Hombre">Hombre</SelectItem>
                    <SelectItem value="Mujer">Mujer</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </header>
      <main className="flex-1 container py-4 md:py-8 px-4 md:px-6">
        <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
          {filtersOpen && (
            <div className="hidden md:block">
              <Card className="overflow-hidden">
                <CardContent className="p-4 md:p-6">
                  <h3 className="font-semibold mb-4">Filtros</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Rango de edad: {ageRange[0]} - {ageRange[1]} años</label>
                      <Slider
                        defaultValue={[18, 80]}
                        min={18}
                        max={80}
                        step={1}
                        value={ageRange}
                        onValueChange={setAgeRange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Género</label>
                      <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona género" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Todos">Todos</SelectItem>
                          <SelectItem value="Hombre">Hombre</SelectItem>
                          <SelectItem value="Mujer">Mujer</SelectItem>
                          <SelectItem value="Otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-2xl font-bold text-center sm:text-left">Encuentra Compañeros</h2>
          </div>

          <div className="flex flex-col items-center justify-center">
            {currentIndex >= matches.length ? (
              <div className="text-center py-8 md:py-12 space-y-4">
                <div className="text-5xl md:text-6xl mb-4">🏋️‍♂️</div>
                <h3 className="text-xl font-medium">No hay más perfiles</h3>
                <p className="text-muted-foreground mb-4">Has visto todos los perfiles disponibles</p>
                <Button onClick={resetCards} className="bg-rose-600 hover:bg-rose-700">
                  Volver a empezar
                </Button>
              </div>
            ) : (
              <div className="relative h-[70vh] sm:h-[450px] md:h-[500px] w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
                <div className="relative w-full h-full">
                  {/* Tarjeta anterior */}
                  {currentIndex > 0 && (
                    <div
                      className="absolute top-0 left-0 h-full w-full origin-center hidden sm:block"
                      style={{
                        transform: "translateX(-70%) scale(0.9) rotate(-6deg)",
                        opacity: 0.7,
                        zIndex: 1,
                      }}
                    >
                      <Card className="h-full overflow-hidden shadow-md">
                        <div className="relative h-full">
                          <img
                            src={matches[currentIndex - 1].image || "/placeholder.svg"}
                            alt="Perfil anterior"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </Card>
                    </div>
                  )}
                  {/* Tarjeta siguiente */}
                  {currentIndex < matches.length - 1 && (
                    <div
                      className="absolute top-0 right-0 h-full w-full origin-center hidden sm:block"
                      style={{
                        transform: "translateX(70%) scale(0.9) rotate(6deg)",
                        opacity: 0.7,
                        zIndex: 1,
                      }}
                    >
                      <Card className="h-full overflow-hidden shadow-md">
                        <div className="relative h-full">
                          <img
                            src={matches[currentIndex + 1].image || "/placeholder.svg"}
                            alt="Perfil siguiente"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </Card>
                    </div>
                  )}
                  {/* Tarjeta actual */}
                  <motion.div
                    ref={cardRef}
                    className="absolute top-0 left-0 right-0 h-full w-full z-10"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    style={{ x, rotate, zIndex: 10 }}
                    onDragEnd={(e, info) => handleSwipe(info)}
                    whileTap={{ cursor: "grabbing" }}
                  >
                    <Card className="h-full overflow-hidden shadow-lg flex flex-col">
                      <div className="relative h-full w-full">
                        <img
                          src={matches[currentIndex].image || "/placeholder.svg"}
                          alt={matches[currentIndex].name}
                          className="object-cover w-full h-full"
                        />
                        <motion.div
                          className="absolute top-4 sm:top-8 left-4 sm:left-8 rounded-full border-4 border-green-500 bg-white/80 p-1 sm:p-2"
                          style={{ opacity: likeOpacity, scale: likeOpacity }}
                          initial={false}
                        >
                          <Heart className="h-24 w-24 sm:h-8 sm:w-8 text-green-500" />
                        </motion.div>
                        <motion.div
                          className="absolute top-4 sm:top-8 right-4 sm:right-8 rounded-full border-4 border-red-500 bg-white/80 p-1 sm:p-2"
                          style={{ opacity: nopeOpacity, scale: nopeOpacity }}
                          initial={false}
                        >
                          <X className="h-24 w-24 sm:h-8 sm:w-8 text-red-500" />
                        </motion.div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-3 sm:p-4 md:p-6">
                          <div className="space-y-1 sm:space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                                {matches[currentIndex].name}, {matches[currentIndex].age}
                              </h3>
                              <div className="flex items-center text-white/80 text-xs sm:text-sm">
                                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                <span>{matches[currentIndex].distance} km</span>
                              </div>
                            </div>
                            <div className="flex items-center text-white/70 text-xs mb-1 sm:mb-2">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{matches[currentIndex].lastActive}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mb-1 sm:mb-2">
                              {matches[currentIndex].goals.map((goal, index) => (
                                <span
                                  key={index}
                                  className="bg-rose-600/80 text-white px-1.5 py-0.5 rounded-full text-xs"
                                >
                                  {goal}
                                </span>
                              ))}
                              {matches[currentIndex].schedule.map((time, index) => (
                                <span
                                  key={index}
                                  className="bg-gray-600/80 text-white px-1.5 py-0.5 rounded-full text-xs"
                                >
                                  {time}
                                </span>
                              ))}
                            </div>
                            <p className="text-xs sm:text-sm text-white/90 line-clamp-3 sm:line-clamp-none">
                              {matches[currentIndex].bio}
                            </p>
                          </div>
                          <div className="flex justify-center gap-[10vw] mt-2 sm:mt-4 md:mt-6">
                                <Button
                                  onClick={dislikeProfile}
                                  size="icon"
                                  className={`h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full ${
                                    isDarkMode ? "bg-gray-800 border-gray-600 hover:bg-gray-700" : "bg-white border-red-500 hover:bg-red-50"
                                  } border-2 flex items-center justify-center`}
                                >
                                  <div className="relative flex items-center justify-center">
                                    <X className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-red-500" />
                                    <ArrowLeft className="absolute -left-4 h-4 w-4 text-red-500" />
                                  </div>
                                </Button>
                                <Button
                                  onClick={likeProfile}
                                  size="icon"
                                  className={`h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full ${
                                    isDarkMode ? "bg-gray-800 border-gray-600 hover:bg-gray-700" : "bg-white border-green-500 hover:bg-green-50"
                                  } border-2 flex items-center justify-center`}
                                >
                                  <div className="relative flex items-center justify-center">
                                    <Heart className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-green-500" />
                                    <ArrowRight className="absolute -right-4 h-4 w-4 text-green-500" />
                                  </div>
                                </Button>
                              </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </div>
              </div>
            )}
          </div>

          {/* Sección de mensajes */}
          {new URLSearchParams(window.location.search).get("tab") === "messages" && (
            <div className="space-y-3 md:space-y-4">
              {conversationsData.length === 0 ? (
                <div className="text-center py-8 md:py-12">
                  <MessageSquare className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No hay mensajes</h3>
                  <p className="text-muted-foreground">Comienza a conectar con otros usuarios</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {conversationsData.map((conversation) => (
                    <Card key={conversation.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <CardContent className="p-3 md:p-4">
                        <div className="flex items-center">
                          <div className="relative mr-3 md:mr-4 flex-shrink-0">
                            <img
                              src={conversation.user.image || "/placeholder.svg"}
                              alt={conversation.user.name}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                            />
                            {conversation.unread && (
                              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-rose-600 rounded-full border-2 border-background"></span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium truncate">{conversation.user.name}</h3>
                              <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                                {conversation.timestamp}
                              </span>
                            </div>
                            <p
                              className={`text-xs sm:text-sm line-clamp-1 ${
                                conversation.unread ? "font-medium" : "text-muted-foreground"
                              }`}
                            >
                              {conversation.lastMessage}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}