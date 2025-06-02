"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LogoutButton({ isDarkMode }: { isDarkMode: boolean }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      className={`hidden md:inline-flex mb-6 mt-4 ${
        isDarkMode
          ? "bg-gray-800 text-white hover:bg-gray-700"
          : "bg-[#e6790c] text-white hover:bg-rose-700"
      }`}
    >
      Cerrar sesión
    </Button>
  );
}