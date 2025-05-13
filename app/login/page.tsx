'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  return (
    <div className={`flex min-h-screen flex-col ${isDarkMode ? "bg-[#04172d] text-white" : "bg-white text-black"}`}>
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
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="ejemplo@correo.com" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link href="/forgot-password" className={`text-xs ${isDarkMode ? "text-gray-400 hover:underline" : "text-[#e6790c] hover:underline"}`}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input id="password" type="password" />
            </div>
            <Button className={`hidden md:inline-flex ${isDarkMode ? "w-full bg-gray-800 text-white hover:bg-gray-700" : "w-full bg-[#e6790c] text-white hover:bg-rose-700"}`}>
              Iniciar sesión
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
          </div>
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