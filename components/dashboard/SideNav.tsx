"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { label: "Usuarios", href: "/dashboard/users" },
  { label: "Preferencias", href: "/dashboard/preferences" },
  { label: "Ubicaciones", href: "/dashboard/locations" },
  { label: "Ejercicios", href: "/dashboard/exercises" },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#e6790c] text-black p-4 space-y-4">
      <img src="public/logo1.png" alt="" /><h2 className="text-xl font-bold">Admin</h2>
      <ul className="space-y-2">
        {navItems.map(item => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={clsx(
                "block px-3 py-2 rounded-md",
                pathname === item.href
                  ? "bg-white font-semibold"
                  : "hover:bg-gray-800"
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
