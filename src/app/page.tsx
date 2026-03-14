'use client'

import { useState } from "react";
import { trackPackage } from "@/actions/tracking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Package, MapPin, Clock, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

// Tipado para el resultado de la búsqueda
type TrackingResult = {
  id: string;
  trackingNumber: string;
  description: string | null;
  weight: number | null;
  status: string;
  history: {
    id: string;
    status: string;
    location: string | null;
    timestamp: Date;
  }[];
};

export default function LandingPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TrackingResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const res = await trackPackage(trackingNumber);

    if (res.success && res.data) {
      setResult(res.data as unknown as TrackingResult);
    } else {
      setError(res.error || "Error desconocido");
    }
    
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <Badge variant="secondary">Pendiente de Envío</Badge>;
      case 'IN_TRANSIT': return <Badge className="bg-blue-500">En Tránsito</Badge>;
      case 'DELIVERED': return <Badge className="bg-green-500">Entregado</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'PENDING': return "Registrado";
      case 'IN_TRANSIT': return "En Tránsito";
      case 'DELIVERED': return "Entregado";
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Navbar Público */}
      <header className="w-full border-b bg-white dark:bg-gray-900 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold tracking-tight">TrackFlow</span>
        </div>
        <div className="flex gap-2">
          <Link href="/login">
            <Button variant="outline" size="sm">
              Acceso Empleados <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section & Buscador */}
      <main className="flex-1 flex flex-col items-center justify-start pt-20 px-4">
        <div className="text-center max-w-2xl mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
            Rastrea tu envío en <span className="text-blue-600">tiempo real</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Ingresa tu número de tracking (Ej: TRK-XXXXX) para conocer el estado exacto de tu mercancía.
          </p>
        </div>

        <Card className="w-full max-w-xl shadow-lg border-0 ring-1 ring-gray-200 dark:ring-gray-800">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="TRK-..." 
                  className="pl-10 h-12 text-lg uppercase"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-md" disabled={loading}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Rastrear"}
              </Button>
            </form>

            {error && (
              <div className="mt-4 flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resultados del Tracking */}
        {result && (
          <div className="w-full max-w-2xl mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold">{result.trackingNumber}</CardTitle>
                    <p className="text-muted-foreground mt-1">{result.description || "Sin descripción"}</p>
                  </div>
                  {getStatusBadge(result.status)}
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-4">Historial de Movimientos</h3>
                
                {result.history.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>El paquete ha sido registrado pero aún no tiene movimientos.</p>
                  </div>
                ) : (
                  <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-800">
                    {result.history.map((event, index) => (
                      <div key={event.id} className="relative">
                        {/* Indicador de posición */}
                        <div className={`absolute -left-[30px] p-1 rounded-full border-4 border-gray-50 dark:border-gray-950 z-10 ${
                          index === 0 ? 'bg-blue-600 p-1.5' : 'bg-gray-300 dark:bg-gray-700'
                        }`}>
                          {index === 0 ? <MapPin className="h-4 w-4 text-white" /> : <Clock className="h-3 w-3 text-white" />}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <div>
                            <p className={`font-bold ${index === 0 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                              {translateStatus(event.status)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {event.location || "Ubicación no especificada"}
                            </p>
                          </div>
                          <time className="text-xs font-medium text-gray-400 whitespace-nowrap">
                            {new Date(event.timestamp).toLocaleDateString('es-ES', { 
                              day: '2-digit', 
                              month: '2-digit', 
                              year: 'numeric' 
                            })} {new Date(event.timestamp).toLocaleTimeString('es-ES', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </time>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="w-full border-t bg-white dark:bg-gray-900 p-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} TrackFlow Logistics. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
