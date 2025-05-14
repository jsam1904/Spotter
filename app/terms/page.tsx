'use client';

import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black dark:bg-[#04172d] dark:text-white transition duration-700 ease-in-out">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Términos y Condiciones</h1>
        <p className="mb-4">
          Bienvenido a Spotter. Al utilizar nuestra plataforma, aceptas cumplir con los siguientes términos y condiciones. Por favor, léelos cuidadosamente antes de usar nuestros servicios.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">1. Uso de la plataforma</h2>
        <p className="mb-4">
          Spotter proporciona una plataforma para [describe brevemente el propósito de tu aplicación]. Al usar nuestra plataforma, aceptas no utilizarla para actividades ilegales o no autorizadas.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">2. Privacidad</h2>
        <p className="mb-4">
          Respetamos tu privacidad. Consulta nuestra <Link href="/privacy" className="text-[#e6790c] hover:underline">Política de Privacidad</Link> para obtener más información sobre cómo manejamos tus datos.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">3. Propiedad intelectual</h2>
        <p className="mb-4">
          Todo el contenido de Spotter, incluidos logotipos, textos, gráficos y otros elementos, está protegido por derechos de autor y otras leyes de propiedad intelectual. No puedes copiar, modificar ni distribuir ningún contenido sin nuestro permiso previo.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">4. Limitación de responsabilidad</h2>
        <p className="mb-4">
          Spotter no será responsable de ningún daño directo, indirecto, incidental o consecuente que surja del uso de nuestra plataforma.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">5. Cambios en los términos</h2>
        <p className="mb-4">
          Nos reservamos el derecho de actualizar estos términos en cualquier momento. Te notificaremos sobre cambios importantes mediante un aviso en nuestra plataforma.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">6. Contacto</h2>
        <p className="mb-4">
          Si tienes preguntas sobre estos términos, contáctanos en <a href="mailto:soporte@spotter.com" className="text-[#e6790c] hover:underline">soporte@spotter.com</a>.
        </p>

        <Link href="/" className="text-[#e6790c] hover:underline mt-6 inline-block">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}