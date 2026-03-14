'use client'

import { useState } from "react";
import { createShipment } from "@/actions/shipment";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Truck, Loader2, AlertCircle } from "lucide-react";

type Driver = { id: string; name: string | null; email: string };
type Package = { id: string; trackingNumber: string; description: string | null };

export function CreateShipmentDialog({ drivers, pendingPackages }: { drivers: Driver[], pendingPackages: Package[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // NUEVO: Estado controlado para el selector (Base UI usa string | null)
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(event.currentTarget);
    const result = await createShipment(formData);
    
    setLoading(false);
    
    if (result.success) {
      setOpen(false);
      setSelectedDriverId(null); // Limpiamos el estado al cerrar
    } else {
      setError(result.error || "Error desconocido");
    }
  }

  // Función auxiliar para obtener el nombre a mostrar
  const getSelectedDriverName = () => {
    if (!selectedDriverId) return "Selecciona un conductor";
    const driver = drivers.find(d => d.id === selectedDriverId);
    return driver ? (driver.name || driver.email) : "Selecciona un conductor";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Truck className="mr-2 h-4 w-4" /> Crear Envío
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Asignar Ruta a Conductor</DialogTitle>
          <DialogDescription>
            Selecciona un conductor y los paquetes que llevará en este viaje.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="driverId">Conductor Asignado</Label>
            {/* NUEVO: Select Controlado compatible con Base UI */}
            <Select 
              name="driverId" 
              required 
              value={selectedDriverId} 
              onValueChange={setSelectedDriverId}
            >
              <SelectTrigger>
                {/* Forzamos a que muestre el nombre calculado */}
                <SelectValue placeholder="Selecciona un conductor">
                  {getSelectedDriverName()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {drivers.length === 0 ? (
                  <SelectItem value="none" disabled>No hay conductores disponibles</SelectItem>
                ) : (
                  drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name || driver.email}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Paquetes Pendientes ({pendingPackages.length})</Label>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              {pendingPackages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center mt-16">
                  No hay paquetes pendientes por enviar.
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingPackages.map((pkg) => (
                    <div key={pkg.id} className="flex items-start space-x-3">
                      <Checkbox id={`pkg-${pkg.id}`} name="packageIds" value={pkg.id} />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={`pkg-${pkg.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {pkg.trackingNumber}
                        </label>
                        <p className="text-sm text-muted-foreground">
                          {pkg.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-500 bg-red-50 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <Button type="submit" disabled={loading || pendingPackages.length === 0}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Iniciar Ruta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
