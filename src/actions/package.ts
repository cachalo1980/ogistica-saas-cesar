'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPackage(formData: FormData) {
  const description = formData.get("description") as string;
  const weight = parseFloat(formData.get("weight") as string);
  const senderId = formData.get("senderId") as string;

  // Generar un Tracking Number único (Ej: TRK-8A3F9)
  const randomString = Math.random().toString(36).substring(2, 7).toUpperCase();
  const trackingNumber = `TRK-${randomString}`;

  try {
    await prisma.package.create({
      data: {
        trackingNumber,
        description,
        weight,
        senderId,
        status: "PENDING",
      },
    });

    // Recargar la página de paquetes para mostrar el nuevo dato
    revalidatePath("/dashboard/packages");
    return { success: true };
  } catch (error) {
    console.error("Error creando paquete:", error);
    return { success: false, error: "No se pudo crear el paquete" };
  }
}
