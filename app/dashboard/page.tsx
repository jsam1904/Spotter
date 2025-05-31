import { User, Heart, MapPin, Dumbbell } from "lucide-react";
import Link from "next/link";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle"; // Ajusta la ruta si es necesario

export default function DashboardHome() {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-white dark:bg-gray-900 transition-colors">
      <h1 className="text-2xl font-bold text-black dark:text-white">
        Bienvenido al Dashboard
      </h1>
      <p className="mt-2 mb-8 text-gray-700 dark:text-gray-300">
        Selecciona una sección desde el menú.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl flex-1">
        <Link
          href="/dashboard/users"
          className="w-full h-full flex flex-col items-center justify-center bg-[#e6790c] dark:bg-[#1e293b] rounded-lg shadow p-8 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <User size={100} className="mb-3 text-black dark:text-white" />
          <span className="font-semibold text-xl text-black dark:text-white">
            Usuarios
          </span>
        </Link>
        <Link
          href="/dashboard/preferences"
          className="w-full h-full flex flex-col items-center justify-center bg-[#e6790c] dark:bg-[#1e293b] rounded-lg shadow p-8 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <Heart size={100} className="mb-3 text-black dark:text-white" />
          <span className="font-semibold text-xl text-black dark:text-white">
            Preferencias
          </span>
        </Link>
        <Link
          href="/dashboard/locations"
          className="w-full h-full flex flex-col items-center justify-center bg-[#e6790c] dark:bg-[#1e293b] rounded-lg shadow p-8 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <MapPin size={100} className="mb-3 text-black dark:text-white" />
          <span className="font-semibold text-xl text-black dark:text-white">
            Ubicaciones
          </span>
        </Link>
        <Link
          href="/dashboard/exercises"
          className="w-full h-full flex flex-col items-center justify-center bg-[#e6790c] dark:bg-[#1e293b] rounded-lg shadow p-8 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <Dumbbell size={100} className="mb-3 text-black dark:text-white" />
          <span className="font-semibold text-xl text-black dark:text-white">
            Ejercicios
          </span>
        </Link>
      </div>
    </div>
  );
}