'use client'

import { useState } from "react";
import { createPackage } from "@/actions/package";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Loader2 } from "lucide-react";

// Definimos el tipo de los usuarios que recibimos como props
type UserOption = {
  id: string;
  name: string | null;
  email: string;
};

export function CreatePackageDialog({ users }: { users: UserOption[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    
    const formData = new FormData(event.currentTarget);
    const result = await createPackage(formData);
    
    setLoading(false);
    
    if (result.success) {
      setOpen(false); // Cerrar el modal si fue exitoso
    } else {
      alert(result.error); // En un entorno real usaríamos un Toast
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Paquete
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Paquete</DialogTitle>
          <DialogDescription>
            Ingresa los detalles de la mercancía. El número de tracking se generará automáticamente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descripción de la mercancía</Label>
            <Input id="description" name="description" placeholder="Ej. Repuestos de motor" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input id="weight" name="weight" type="number" step="0.1" placeholder="Ej. 25.5" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senderId">Cliente / Remitente</Label>
            <Select name="senderId" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un cliente" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name || user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Guardar Paquete"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
