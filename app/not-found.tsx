import Link from "next/link"
import { Home, Dumbbell } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-gray-50 flex items-center justify-center overflow-hidden">
      {/* GIF ocupa el fondo */}
      <img
        src="https://i.pinimg.com/originals/a9/e3/10/a9e31048503978d8c8c756f9dee6641c.gif"
        alt="Gym animation"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        style={{ zIndex: 0 }}
      />

      <div className="relative z-10 flex flex-col items-center justify-between w-full max-w-4xl h-full min-h-screen px-2 py-4">
        <div className="ml-10 mt-4 mb-4 text-center sm:mt-16">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 mb-1 drop-shadow-lg">
            404
          </h1>
         
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-auto mb-4 w-full">

          <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-2 drop-shadow-lg">
            Página no encontrada
          </h2>
          <Button
            asChild
            size="sm"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-2 text-base"
          >
            <Link href="/" className="flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Volver al inicio</span>
            </Link>
          </Button>


        </div>
      </div>
    </div>
  )
}
