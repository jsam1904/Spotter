import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dumbbell } from "lucide-react"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Link href="/" className="flex items-center gap-2">
              <Dumbbell className="h-8 w-8 text-rose-600" />
              <span className="text-2xl font-bold">Spotter</span>
            </Link>
            <h1 className="text-2xl font-bold">Crear una cuenta</h1>
            <p className="text-sm text-muted-foreground">Regístrate para comenzar a usar Spotter</p>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">Nombre</Label>
                <Input id="first-name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Apellido</Label>
                <Input id="last-name" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="ejemplo@correo.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar contraseña</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                Acepto los{" "}
                <Link href="/terms" className="text-rose-600 hover:underline">
                  términos y condiciones
                </Link>
              </label>
            </div>
            <Button className="w-full bg-rose-600 hover:bg-rose-700">Registrarse</Button>
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <span className="relative bg-background px-2 text-xs text-muted-foreground">O continúa con</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline">Google</Button>
              <Button variant="outline">Facebook</Button>
            </div>
            <div className="text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-rose-600 hover:underline">
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
