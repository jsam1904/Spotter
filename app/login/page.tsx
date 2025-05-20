'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validaciones
    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos.",
      });
      setIsLoading(false);
      return;
    }

    try {
      console.log("Iniciando sesión con:", { email, password });
      const response = await axios.post("http://localhost:3000/login/", {
        email, 
        password,
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Inicio de sesión exitoso",
          text: "Bienvenido a Spotter",
        }).then(() => {
          localStorage.setItem("token", response.data.token);
          router.push("/UserPage");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "Credenciales inválidas",
        });
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error en el inicio de sesión",
        text: error.response?.data?.error || "Ocurrió un error al iniciar sesión",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen flex-col transition duration-700 ease-in-out ${isDarkMode ? "bg-[#04172d] text-white" : "bg-white text-black"}`}>
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={isDarkMode ? "/logo2.png" : "/logo1.png"}
                alt="Spotter Logo"
                width={70}
                height={70}
              />
              <span className="text-2xl font-bold">Spotter</span>
            </Link>
            <h1 className="text-2xl font-bold">Iniciar sesión</h1>
            <p className="text-sm text-muted-foreground">Ingresa tus credenciales para acceder a tu cuenta</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full ${isDarkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-[#e6790c] text-white hover:bg-rose-700"}`}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <span className="relative bg-background px-2 text-xs text-muted-foreground">O continúa con</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline">Google</Button>
              <Button variant="outline">Facebook</Button>
            </div>
            <div className="text-center text-sm">
              ¿No tienes una cuenta?{" "}
              <Link href="/signup" className={`text-s ${isDarkMode ? "text-gray-400 hover:underline" : "text-[#e6790c] hover:underline"}`}>
                Regístrate
              </Link>
            </div>
          </form>
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
      </div>
    </div>
  );
}