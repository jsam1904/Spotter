import { User, Heart, MapPin, Dumbbell } from "lucide-react";
import Link from "next/link";

export default function DashboardHome() {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold">Bienvenido al Dashboard</h1>
      <p className="mt-2 mb-8">Selecciona una sección desde el menú.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl flex-1">
        <Link
          href="/dashboard/users"
          className="w-full h-full flex flex-col items-center justify-center bg-[#e6790c] rounded-lg shadow p-8 hover:bg-gray-100 transition"
        >
          <User size={100} className="mb-3 text-black" />
          <span className="font-semibold text-xl">Usuarios</span>
        </Link>
        <Link
          href="/dashboard/preferences"
          className="w-full h-full flex flex-col items-center justify-center bg-[#e6790c] rounded-lg shadow p-8 hover:bg-gray-100 transition"
        >
          <Heart size={100} className="mb-3 text-black" />
          <span className="font-semibold text-xl">Preferencias</span>
        </Link>
        <Link
          href="/dashboard/locations"
          className="w-full h-full flex flex-col items-center justify-center bg-[#e6790c] rounded-lg shadow p-8 hover:bg-gray-100 transition"
        >
          <MapPin size={100} className="mb-3 text-black" />
          <span className="font-semibold text-xl">Ubicaciones</span>
        </Link>
        <Link
          href="/dashboard/exercises"
          className="w-full h-full flex flex-col items-center justify-center bg-[#e6790c] rounded-lg shadow p-8 hover:bg-gray-100 transition"
        >
          <Dumbbell size={100} className="mb-3 text-black" />
          <span className="font-semibold text-xl">Ejercicios</span>
        </Link>
      </div>
    </div>
  );
}