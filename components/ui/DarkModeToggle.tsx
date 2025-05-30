import { Sun, Moon } from "lucide-react"

interface DarkModeToggleProps {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

export function DarkModeToggle({ isDarkMode, toggleDarkMode }: DarkModeToggleProps) {
  return (
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
          isDarkMode
            ? "translate-x-6 bg-gray-900/80"
            : "translate-x-0 bg-white/60"
        } z-10`}
      ></div>
    </div>
  )
}