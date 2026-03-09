import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PackageOpen, ArrowRight, Truck, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="px-6 h-16 flex items-center border-b bg-white shadow-sm">
        <Link className="flex items-center justify-center" href="#">
          <PackageOpen className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold text-gray-900">TrackFlow SaaS</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login">
            <Button variant="ghost" className="hidden sm:flex">
              Iniciar Sesión
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button>
              Ir al Panel <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 md:py-24 lg:py-32">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-gray-900">
            Logística Simplificada para tu Negocio
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Gestiona la recepción, almacenamiento y entrega final de paquetes desde un único panel centralizado y seguro.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Link href="/dashboard">
              <Button size="lg" className="px-8 h-12">
                Ingresar al Sistema
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12 mt-16 text-left">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left p-6 bg-white rounded-xl shadow-sm border">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mb-4">
              <Truck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Gestión de Envíos</h3>
            <p className="mt-2 text-gray-500">Asigna rutas y paquetes a tus conductores en tiempo real.</p>
          </div>
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left p-6 bg-white rounded-xl shadow-sm border">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Máxima Seguridad</h3>
            <p className="mt-2 text-gray-500">Control de acceso estricto (RBAC) para clientes, conductores y admins.</p>
          </div>
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left p-6 bg-white rounded-xl shadow-sm border">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg mb-4">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Rendimiento</h3>
            <p className="mt-2 text-gray-500">Arquitectura híbrida moderna para una experiencia de usuario sin interrupciones.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t px-6 flex items-center justify-center sm:justify-between bg-white">
        <p className="text-xs text-gray-500">
          © 2026 TrackFlow SaaS. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}
