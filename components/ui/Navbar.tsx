'use client'
import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DarkModeToggle } from "@/components/ui/DarkModeToggle"
import { ReactNode, useState } from "react"

interface NavLink {
  href: string
  label: string
}

interface NavbarProps {
  isDarkMode: boolean
  toggleDarkMode: () => void
  links: NavLink[]
  actions?: ReactNode // <-- Nueva prop opcional para botones personalizados
}

export function Navbar({ isDarkMode, toggleDarkMode, links, actions }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className={`sticky top-0 z-50 w-full border-b ${isDarkMode ? "bg-[#01152b]" : "bg-[#faf6eb]"} backdrop-blur supports-[backdrop-filter]:bg-opacity-95`}>
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
        <nav className="hidden md:flex gap-6">
          {links.map(link => (
            <Link key={link.href} href={link.href} className="text-sm font-medium transition-colors hover:text-foreground/80">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          {actions}
        </div>
        <button
          className="md:hidden flex items-center"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center gap-4 p-4 bg-background">
          {links.map(link => (
            <Link key={link.href} href={link.href} className="text-sm font-medium transition-colors hover:text-foreground/80">
              {link.label}
            </Link>
          ))}
          <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          {actions}
        </div>
      )}
    </header>
  )
}