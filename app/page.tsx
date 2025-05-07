import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Dumbbell, Users, Calendar, Search } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-rose-600" />
            <span className="text-xl font-bold">Spotter</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Características
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Cómo funciona
            </Link>
            <Link href="#testimonials" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Testimonios
            </Link>
            <Link href="#faq" className="text-sm font-medium transition-colors hover:text-foreground/80">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <a href="/login">
              <Button className="hidden md:inline-flex bg-rose-600 text-white hover:bg-rose-700">
                Iniciar sesión
              </Button>
            </a>
            <a href="/signup">
              <Button variant="outline" className="hidden md:inline-flex bg-black text-white hover:bg-rose-600">
                Registrarse
              </Button>
            </a>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Encuentra rutinas personalizadas y compañeros de gimnasio
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Spotter te conecta con rutinas adaptadas a tus objetivos y con personas que comparten tus mismas
                    metas fitness.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="bg-rose-600 hover:bg-rose-700">
                    Comenzar ahora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    Saber más
                  </Button>
                </div>
              </div>
              <Image
                src="/placeholder.svg?height=550&width=550"
                width={550}
                height={550}
                alt="Hero"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-rose-100 px-3 py-1 text-sm text-rose-700">
                  Características
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Todo lo que necesitas para alcanzar tus metas
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Spotter te ofrece todas las herramientas para optimizar tu entrenamiento y encontrar la motivación que
                  necesitas.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
                  <Dumbbell className="h-8 w-8 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold">Rutinas personalizadas</h3>
                <p className="text-center text-muted-foreground">
                  Obtén rutinas adaptadas a tus objetivos, nivel de experiencia y preferencias.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
                  <Users className="h-8 w-8 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold">Encuentra compañeros</h3>
                <p className="text-center text-muted-foreground">
                  Conecta con personas que tienen objetivos similares o buscan un compañero de entrenamiento.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
                  <Calendar className="h-8 w-8 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold">Seguimiento de progreso</h3>
                <p className="text-center text-muted-foreground">
                  Registra tus entrenamientos y visualiza tu progreso a lo largo del tiempo.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-rose-100 px-3 py-1 text-sm text-rose-700">Cómo funciona</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, rápido y efectivo</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  En solo unos pasos podrás comenzar a utilizar todas las funcionalidades de Spotter.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2">
              <Image
                src="/placeholder.svg?height=400&width=500"
                width={500}
                height={400}
                alt="Cómo funciona"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center"
              />
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-700">
                      1
                    </div>
                    <div>
                      <h3 className="font-bold">Crea tu perfil</h3>
                      <p className="text-muted-foreground">
                        Regístrate y completa tu perfil con tus objetivos, experiencia y preferencias.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-700">
                      2
                    </div>
                    <div>
                      <h3 className="font-bold">Descubre rutinas</h3>
                      <p className="text-muted-foreground">
                        Explora rutinas personalizadas según tus objetivos y nivel de experiencia.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-700">
                      3
                    </div>
                    <div>
                      <h3 className="font-bold">Conecta con otros</h3>
                      <p className="text-muted-foreground">
                        Encuentra personas con objetivos similares o que buscan un compañero de gimnasio.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-rose-100 px-3 py-1 text-sm text-rose-700">Testimonios</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Lo que dicen nuestros usuarios</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Descubre cómo Spotter ha ayudado a miles de personas a alcanzar sus metas fitness.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-start space-y-4 rounded-lg border p-6">
                <div className="flex items-center gap-4">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    width={40}
                    height={40}
                    alt="Avatar"
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-bold">Carlos M.</h3>
                    <p className="text-sm text-muted-foreground">Miembro desde 2023</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "Gracias a Spotter encontré un compañero de entrenamiento con mis mismos objetivos. Ahora vamos juntos
                  al gimnasio y nos motivamos mutuamente."
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4 rounded-lg border p-6">
                <div className="flex items-center gap-4">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    width={40}
                    height={40}
                    alt="Avatar"
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-bold">Laura P.</h3>
                    <p className="text-sm text-muted-foreground">Miembro desde 2022</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "Las rutinas personalizadas me han ayudado a progresar mucho más rápido. Además, la comunidad es
                  increíble y muy motivadora."
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4 rounded-lg border p-6">
                <div className="flex items-center gap-4">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    width={40}
                    height={40}
                    alt="Avatar"
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-bold">Miguel A.</h3>
                    <p className="text-sm text-muted-foreground">Miembro desde 2023</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "Soy principiante y gracias a Spotter pude encontrar rutinas adecuadas para mi nivel. Ahora entreno
                  con confianza y veo resultados."
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-rose-100 px-3 py-1 text-sm text-rose-700">Únete ahora</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Comienza tu viaje fitness hoy mismo
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed">
                  Regístrate gratis y descubre todo lo que Spotter tiene para ofrecerte.
                </p>
                <Button size="lg" className="bg-rose-600 hover:bg-rose-700">
                  Registrarse gratis
                </Button>
              </div>
              <div className="flex flex-col space-y-4 rounded-xl border bg-muted p-6">
                <h3 className="text-xl font-bold">Busca compañeros cerca de ti</h3>
                <p className="text-muted-foreground">
                  Encuentra personas en tu zona que comparten tus objetivos fitness.
                </p>
                <div className="flex flex-col space-y-2">
                  <div className="flex gap-2">
                    <Input placeholder="Tu ubicación" />
                    <Button variant="outline">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Ejemplo: Madrid, Barcelona, Valencia...</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-rose-100 px-3 py-1 text-sm text-rose-700">FAQ</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Preguntas frecuentes</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Respuestas a las preguntas más comunes sobre Spotter.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-bold">¿Es gratis usar Spotter?</h3>
                <p className="text-muted-foreground">
                  Sí, Spotter ofrece un plan gratuito con funcionalidades básicas. También contamos con planes premium
                  con características adicionales.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold">¿Cómo encuentro compañeros de gimnasio?</h3>
                <p className="text-muted-foreground">
                  Después de crear tu perfil, podrás buscar personas en tu zona que tengan objetivos similares o que
                  estén buscando un compañero de entrenamiento.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold">¿Las rutinas son realmente personalizadas?</h3>
                <p className="text-muted-foreground">
                  Sí, nuestro algoritmo crea rutinas basadas en tus objetivos, nivel de experiencia, preferencias y
                  equipamiento disponible.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold">¿Puedo usar Spotter si soy principiante?</h3>
                <p className="text-muted-foreground">
                  ¡Absolutamente! Spotter es ideal para principiantes, ya que ofrece rutinas adaptadas a todos los
                  niveles y guía paso a paso.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold">¿Cómo funciona el seguimiento de progreso?</h3>
                <p className="text-muted-foreground">
                  Puedes registrar tus entrenamientos, pesos, repeticiones y otros datos relevantes. Spotter te mostrará
                  gráficos y estadísticas de tu progreso.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold">¿Está disponible en mi país?</h3>
                <p className="text-muted-foreground">
                  Spotter está disponible en la mayoría de los países. La funcionalidad de encontrar compañeros depende
                  de la cantidad de usuarios en tu zona.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-rose-600" />
            <span className="text-xl font-bold">Spotter</span>
          </div>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Spotter. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Términos
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Privacidad
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Contacto
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
