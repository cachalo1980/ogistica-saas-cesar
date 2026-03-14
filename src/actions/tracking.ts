'use server'

import { prisma } from "@/lib/prisma";

export async function trackPackage(trackingNumber: string) {
  if (!trackingNumber || trackingNumber.trim() === "") {
    return { success: false, error: "Por favor ingresa un número de tracking válido." };
  }

  try {
    const pkg = await prisma.package.findUnique({
      where: {
        trackingNumber: trackingNumber.trim().toUpperCase(),
      },
      include: {
        history: {
          orderBy: {
            timestamp: 'desc', // Los eventos más recientes primero
          },
        },
      },
    });

    if (!pkg) {
      return { success: false, error: "No se encontró ningún paquete con ese número de tracking." };
    }

    return { success: true, data: pkg };
  } catch (error) {
    console.error("Error buscando tracking:", error);
    return { success: false, error: "Ocurrió un error al buscar el paquete. Intenta de nuevo." };
  }
}
