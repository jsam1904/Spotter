"use client"

import { Dumbbell, Zap } from "lucide-react"

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="relative">
        <div className="flex items-center space-x-4 mb-8">
          <Dumbbell className="w-12 h-12 text-orange-600 animate-bounce" style={{ animationDelay: "0ms" }} />
          <Dumbbell className="w-16 h-16 text-red-600 animate-bounce" style={{ animationDelay: "150ms" }} />
          <Dumbbell className="w-12 h-12 text-orange-600 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>

        <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse">
            <div className="h-full bg-gradient-to-r from-orange-400 to-red-400 rounded-full animate-ping"></div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-500 animate-pulse" />
          <span className="text-xl font-bold text-gray-700 animate-pulse">Cargando...</span>
          <Zap className="w-5 h-5 text-yellow-500 animate-pulse" />
        </div>

        <p className="text-center text-gray-600 mt-4 animate-fade-in">
          ¡Preparando la mejor experiencia para ti!
        </p>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 2s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  )
}
