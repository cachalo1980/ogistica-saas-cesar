'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createShipment(formData: FormData) {
  const driverId = formData.get("driverId") as string;
  // Obtenemos todos los checkboxes seleccionados (sus values son los IDs de los paquetes)
  const packageIds = formData.getAll("packageIds") as string[];

  if (!driverId || packageIds.length === 0) {
    return { success: false, error: "Debes seleccionar un conductor y al menos un paquete." };
  }

  try {
    // Usamos una Transacción: O se ejecuta todo, o no se ejecuta nada (Pilar 2: Rendimiento y Mantenibilidad)
    await prisma.$transaction(async (tx) => {
      // 1. Crear el Envío (Shipment)
      const shipment = await tx.shipment.create({
        data: {
          driverId,
          status: "ACTIVE",
        },
      });

      // 2. Actualizar los paquetes seleccionados
      await tx.package.updateMany({
        where: {
          id: { in: packageIds },
        },
        data: {
          shipmentId: shipment.id,
          status: "IN_TRANSIT",
        },
      });

      // 3. Crear el historial de auditoría para cada paquete
      const historyRecords = packageIds.map((pkgId) => ({
        packageId: pkgId,
        status: "IN_TRANSIT" as const,
        location: "Centro de Distribución (Salida)",
      }));

      await tx.statusHistory.createMany({
        data: historyRecords,
      });
    });

    revalidatePath("/dashboard/shipments");
    revalidatePath("/dashboard/packages"); // Revalidamos paquetes también porque cambiaron de estado
    return { success: true };
    
  } catch (error) {
    console.error("Error creando envío:", error);
    return { success: false, error: "Ocurrió un error al procesar el envío." };
  }
}
