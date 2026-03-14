import { prisma } from "@/lib/prisma";
import { CreatePackageDialog } from "@/components/packages/create-package-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Forzamos a que esta página sea dinámica para que siempre muestre datos frescos
export const dynamic = 'force-dynamic';

export default async function PackagesPage() {
  // 1. Consultamos los paquetes incluyendo los datos del remitente
  const packages = await prisma.package.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      sender: {
        select: { name: true, email: true }
      }
    }
  });

  // 2. Consultamos los usuarios para pasarlos al formulario de creación
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' }
  });

  // Función auxiliar para el color del estado
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <Badge variant="secondary">Pendiente</Badge>;
      case 'IN_TRANSIT': return <Badge className="bg-blue-500">En Tránsito</Badge>;
      case 'DELIVERED': return <Badge className="bg-green-500">Entregado</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Paquetes</h1>
        <CreatePackageDialog users={users} />
      </div>

      <div className="rounded-md border bg-white dark:bg-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tracking</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Peso</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  No hay paquetes registrados.
                </TableCell>
              </TableRow>
            ) : (
              packages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell className="font-medium">{pkg.trackingNumber}</TableCell>
                  <TableCell>{pkg.description}</TableCell>
                  <TableCell>{pkg.sender.name || pkg.sender.email}</TableCell>
                  <TableCell>{pkg.weight} kg</TableCell>
                  <TableCell>{getStatusBadge(pkg.status)}</TableCell>
                  <TableCell className="text-right">
                    {/* NUEVO: Formato DD/MM/AAAA */}
                    {new Date(pkg.createdAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
