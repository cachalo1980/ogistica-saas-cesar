'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";
import { UserRole } from "@prisma/client";

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as UserRole;

  if (!email || !password || !role) {
    return { success: false, error: "Faltan campos obligatorios" };
  }

  try {
    // 1. Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return { success: false, error: "El correo electrónico ya está registrado" };
    }

    // 2. Encriptar la contraseña (Pilar 1: Seguridad)
    const hashedPassword = await hash(password, 12);

    // 3. Guardar en base de datos
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // 4. Actualizar la UI
    revalidatePath("/dashboard/users");
    return { success: true };
    
  } catch (error) {
    console.error("Error creando usuario:", error);
    return { success: false, error: "Ocurrió un error inesperado al crear el usuario" };
  }
}
