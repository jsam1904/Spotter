'use client';

import { ReactNode, useState, useEffect } from "react";
import SideNav from "@/components/dashboard/SideNav";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";

export default function DashboardLayout({ children }: { children: ReactNode }) {
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
    <div className="flex min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <SideNav isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-1 p-6 relative">
        <div className="absolute top-6 right-6 z-10">
          <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        </div>
        {children}
      </main>
    </div>
  );
}