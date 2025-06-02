'use client';

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { MapPin, MessageSquare, Clock, X, Heart, Sun, Moon, Menu, Filter, ArrowLeft, ArrowRight, Dumbbell } from "lucide-react";
import { Slider } from "../../components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { motion, type PanInfo, useMotionValue, useTransform } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";
import { DarkModeToggle } from "../../components/ui/DarkModeToggle";
import { Navbar } from "../../components/ui/Navbar"; // <-- Importa tu Navbar
import LoadingSpinner from "../../components/loading-spinner";

// Define TypeScript interface for user data
interface User {
  email: string;
  username: string;
  name: string;
  age: number;
  gender: string;
  bio: string;
  prof_pic: string;
  about_pics: string[];
  preferences: string[];
  gym: string;
  score: number;
}

export default function FindMatches() {
  const [ageRange, setAgeRange] = useState([18, 80]);
  const [gender, setGender] = useState("Todos");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<User[]>([]);
  const [likedProfiles, setLikedProfiles] = useState<string[]>([]);
  const [dislikedProfiles, setDislikedProfiles] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentImageIndices, setCurrentImageIndices] = useState<number[]>([]); // Track current image index for each user
  const [loading, setLoading] = useState(true);

  // Get email from JWT token
  const getUserEmail = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.email;
      } catch (e) {
        console.error("Error decoding token:", e);
        return null;
      }
    }
    return null;
  };

  // Mueve fetchRecommendations aquí para poder reutilizarla
  const fetchRecommendations = async () => {
    setLoading(true);
    const userEmail = getUserEmail();
    if (!userEmail) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo obtener el correo del usuario. Por favor, inicia sesión nuevamente.",
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }
    try {
      const response = await axios.get(`http://localhost:3000/users/${userEmail}/recommend-users`);
      const users: User[] = response.data.recommendations.map((user: any) => ({
        ...user,
        age: parseInt(user.age, 10),
      }));
      const filteredUsers = users.filter(
        (user) =>
          user.age >= ageRange[0] &&
          user.age <= ageRange[1] &&
          (gender === "Todos" || user.gender === gender)
      );
      setMatches(filteredUsers);
      setCurrentImageIndices(new Array(filteredUsers.length).fill(0));
      setCurrentIndex(0);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching recommendations:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las recomendaciones. Intenta de nuevo más tarde.",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  // Handle theme toggle
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

  // Handle image cycling
  const handleImageClick = (userIndex: number) => {
    setCurrentImageIndices((prev) => {
      const newIndices = [...prev];
      const userImages = matches[userIndex].about_pics.length > 0 ? matches[userIndex].about_pics : [matches[userIndex].prof_pic];
      newIndices[userIndex] = (newIndices[userIndex] + 1) % userImages.length;
      return newIndices;
    });
  };

  // Animations for swiping
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

  const likeProfile = async () => {
    if (currentIndex >= matches.length) return;
    const userEmail = getUserEmail();
    const likedUserEmail = matches[currentIndex].email;
    try {
      const response = await axios.post(
      `http://localhost:3000/users/like/${userEmail}`,
      { emailToLike: likedUserEmail }
            );
      if (response.status === 200) {
        Swal.fire({
          title: "¡Encontraste un nuevo spotter!",
          html: `
            <div id="custom-spotter-animation" style="display: flex; align-items: center; justify-content: center; height: 160px;">
              <img id="logo-left" src="/logo1left.png" style="width: 120px; margin-right: -18px; transform: translateX(-30px); transition: transform 1.2s cubic-bezier(.68,-0.55,.27,1.55);" />
              <img id="logo-right" src="/logo1right.png" style="width: 93px; margin-left: -18px; transform: translateX(30px); transition: transform 1.2s cubic-bezier(.68,-0.55,.27,1.55);" />
            </div>
          `,
          didOpen: () => {
            setTimeout(() => {
              // Juntar los logos
              const left = document.getElementById("logo-left");
              const right = document.getElementById("logo-right");
              if (left && right) {
                left.style.transform = "translateX(0)";
                right.style.transform = "translateX(0)";
              }
              setTimeout(() => {
                const container = document.getElementById("custom-spotter-animation");
                if (container) {
                  container.style.transition = "transform 1.2s cubic-bezier(.68,-0.55,.27,1.55)";
                  container.style.transform = "scale(1.6)";
                  setTimeout(() => {
                    container.style.transform = "scale(1)";
                  }, 400);
                }
              }, 700);
            }, 100);
          },
          text: `Has hecho match con ${matches[currentIndex].name}!`,
          showConfirmButton: true,
          customClass: {
            popup: 'swal2-spotter-popup'
          }
        });

      }
      setLikedProfiles([...likedProfiles, likedUserEmail]);
      setCurrentIndex(currentIndex + 1);
      x.set(0);
    } catch (error) {
      console.error("Error liking profile:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo dar like. Intenta de nuevo.",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const dislikeProfile = () => {
    if (currentIndex < matches.length) {
      x.set(-200);
      setTimeout(() => {
        setDislikedProfiles([...dislikedProfiles, matches[currentIndex].email]);
        setCurrentIndex(currentIndex + 1);
        x.set(0);
      }, 200);
    }
  };

  // Modifica resetCards para volver a pedir recomendaciones
  const resetCards = () => {
    setCurrentIndex(0);
    setLikedProfiles([]);
    setDislikedProfiles([]);
    setCurrentImageIndices(new Array(matches.length).fill(0));
    fetchRecommendations(); // <-- vuelve a pedir recomendaciones
  };

  // Links para la navbar
  const links = [
    { href: "/UserPage", label: "Inicio" },
    { href: "/UserPage?tab=discover", label: "Descubrir" },
    { href: "/match/chats", label: "Mensajes" },
    { href: "/Psettings", label: "Perfil" },
  ];

  // Botón de filtros como acción personalizada
  const actions = (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setFiltersOpen(!filtersOpen)}
        className={isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}
      >
        <Filter className="h-4 w-4 mr-2" />
        Filtros
      </Button>
        <Link href="/">
          <Button
            variant="outline"
            className={`hidden md:inline-flex ${isDarkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-[#e6790c] text-white hover:bg-rose-700"}`}
          >
            Cerrar sesión
          </Button>
        </Link>
    </>
  );

  useEffect(() => {
    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ageRange, gender]);

  if (loading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-screen flex-col transition duration-700 ease-in-out ${
        isDarkMode ? "bg-[#222b4b] text-white" : "bg-white text-black"
      }`}
    >
      <Navbar
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        links={links}
        actions={actions}
      />
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
                          <SelectItem value="Masculino">Masculino</SelectItem>
                          <SelectItem value="Femenino">Femenino</SelectItem>
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
                  {/* Previous card */}
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
                            src={
                              matches[currentIndex - 1].about_pics.length > 0
                                ? matches[currentIndex - 1].about_pics[currentImageIndices[currentIndex - 1]] ||
                                  matches[currentIndex - 1].prof_pic
                                : matches[currentIndex - 1].prof_pic || "/placeholder.svg"
                            }
                            alt="Perfil anterior"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </Card>
                    </div>
                  )}
                  {/* Next card */}
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
                            src={
                              matches[currentIndex + 1].about_pics.length > 0
                                ? matches[currentIndex + 1].about_pics[currentImageIndices[currentIndex + 1]] ||
                                  matches[currentIndex + 1].prof_pic
                                : matches[currentIndex + 1].prof_pic || "/placeholder.svg"
                            }
                            alt="Perfil siguiente"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </Card>
                    </div>
                  )}
                  {/* Current card */}
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
                          src={
                            matches[currentIndex].about_pics.length > 0
                              ? matches[currentIndex].about_pics[currentImageIndices[currentIndex]] ||
                                matches[currentIndex].prof_pic
                              : matches[currentIndex].prof_pic || "/placeholder.svg"
                          }
                          alt={matches[currentIndex].name}
                          className="object-cover w-full h-full cursor-pointer"
                          onClick={() => handleImageClick(currentIndex)}
                        />
                        <motion.div
                          className="absolute top-4 sm:top-8 left-4 sm:left-8 rounded-full border-4 border-green-500 bg-white/80 p-1 sm:p-2"
                          style={{ opacity: likeOpacity, scale: likeOpacity }}
                          initial={false}
                        >
                          <Dumbbell className="h-24 w-24 sm:h-8 sm:w-8 text-green-500" />
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
                                <span>{matches[currentIndex].gym}</span>
                              </div>
                            </div>
                            <div className="flex items-center text-white/70 text-xs mb-1 sm:mb-2">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{matches[currentIndex].score.toFixed(2)} compatibilidad</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mb-1 sm:mb-2">
                              {matches[currentIndex].preferences.map((pref, index) => (
                                <span
                                  key={index}
                                  className="bg-rose-600/80 text-white px-1.5 py-0.5 rounded-full text-xs"
                                >
                                  {pref}
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
                                <Dumbbell className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-green-500" />
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
        </div>
      </main>
    </div>
  );
}