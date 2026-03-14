import { prisma } from "@/lib/prisma";
import { CreateShipmentDialog } from "@/components/shipments/create-shipment-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const dynamic = 'force-dynamic';

export default async function ShipmentsPage() {
  // 1. Consultar envíos existentes
  const shipments = await prisma.shipment.findMany({
    orderBy: { startTime: 'desc' },
    include: {
      driver: { select: { name: true, email: true } },
      _count: { select: { packages: true } } // Cuenta cuántos paquetes tiene el envío
    }
  });

  // 2. Consultar datos para el formulario (Conductores y Paquetes Pendientes)
  const drivers = await prisma.user.findMany({
    where: { role: 'DRIVER' },
    select: { id: true, name: true, email: true }
  });

  const pendingPackages = await prisma.package.findMany({
    where: { status: 'PENDING' },
    select: { id: true, trackingNumber: true, description: true }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Envíos</h1>
        <CreateShipmentDialog drivers={drivers} pendingPackages={pendingPackages} />
      </div>

      <div className="rounded-md border bg-white dark:bg-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Envío</TableHead>
              <TableHead>Conductor</TableHead>
              <TableHead>Paquetes</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Fecha de Salida</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shipments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  No hay envíos registrados.
                </TableCell>
              </TableRow>
            ) : (
              shipments.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell className="font-medium text-xs text-gray-500">
                    {shipment.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>{shipment.driver.name || shipment.driver.email}</TableCell>
                  <TableCell>{shipment._count.packages} uds.</TableCell>
                  <TableCell>
                    {shipment.status === 'ACTIVE' 
                      ? <Badge className="bg-blue-500">En Ruta</Badge> 
                      : <Badge variant="secondary">Completado</Badge>
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    {/* RESTAURADO: Formato DD/MM/AAAA HH:mm para envíos */}
                    {new Date(shipment.startTime).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
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
