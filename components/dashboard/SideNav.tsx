"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Usuarios", href: "/dashboard/users" },
  { label: "Preferencias", href: "/dashboard/preferences" },
  { label: "Ubicaciones", href: "/dashboard/locations" },
  { label: "Ejercicios", href: "/dashboard/exercises" },
];

export default function SideNav({
  isDarkMode,
  toggleDarkMode,
}: {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        "w-64 p-4 space-y-4 transition-colors",
        isDarkMode ? "bg-[#222b4b] text-white" : "bg-[#faf6eb] text-black"
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <img src={isDarkMode ? "/logo2.png" : "/logo1.png"} alt="Logo" className="w-20 h-20"/>
        <span className="text-xl font-bold">Admin</span>
      </div>
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={clsx(
                "block px-3 py-2 rounded-md",
                pathname === item.href
                  ? isDarkMode
                    ? "bg-[#01152b] font-semibold"
                    : "bg-white font-semibold"
                  : isDarkMode
                  ? "hover:bg-[#2c365a]"
                  : "hover:bg-stone-300"
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
                            <>
        <Link href="/">
          <Button
            variant="outline"
            className={`hidden md:inline-flex mb-6 mt-4 ${isDarkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-[#e6790c] text-white hover:bg-rose-700"}`}
          >
            Cerrar sesión
          </Button>
        </Link>
      </>
      </ul>
    </aside>
  );
}