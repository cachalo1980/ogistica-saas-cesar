# 🛡️ GLOBAL ANTIGRAVITY RULES FILE: LOGISTICS SAAS 🛡️

Contexto del Proyecto: Plataforma SaaS de Logística (Entregas y Recepción).
Stack Core: Next.js (App Router Fullstack), PostgreSQL (Base de Datos), Prisma (ORM), Tailwind + Shadcn UI.

## 🚨 REGLA DE ORO 1: ESTRATEGIA DE INFRAESTRUCTURA HÍBRIDA
Este proyecto opera bajo un modelo de desarrollo híbrido para maximizar la velocidad (DX):
1. **Base de Datos:** 100% Dockerizada. PostgreSQL corre en un contenedor vía `docker-compose`.
2. **Aplicación (Next.js):** Corre NATIVAMENTE en el host (WSL) durante el desarrollo.
- **Permitido en el Host:** Comandos como `npm install`, `npm run dev`, `npx prisma generate`, `npx prisma migrate dev`, `npx shadcn-ui@latest add`.
- **Prohibido en el Host:** Instalar bases de datos locales (Postgres, MySQL, etc.). Todo servicio de infraestructura debe ir al `docker-compose.yml`.

## 🧠 REGLAS DE ARQUITECTURA Y CÓDIGO (SKULLIS & WORKFLOWS)

### 1. TypeScript Estricto (Mantenibilidad)
- Obligatorio el uso de tipado fuerte. 
- **PROHIBIDO** el uso de `any` a menos que sea una emergencia de fuerza mayor documentada.
- Define interfaces/types claros en `/src/types` para todas las entidades.

### 2. Arquitectura Next.js App Router (Rendimiento)
- **Server Components por defecto:** Usa React Server Components (RSC) siempre que sea posible.
- **Client Components:** Usa `"use client"` SOLO en la parte superior del archivo cuando necesites interactividad (onClick, useState, useEffect).
- **Mutaciones:** Toda lógica de escritura en base de datos debe hacerse mediante **Server Actions** en la carpeta `/src/actions`, NUNCA directamente desde un Client Component.

### 3. Seguridad y SecDevOps (La Cerradura)
- **Validación:** Toda entrada de usuario (formularios, APIs, Server Actions) DEBE ser validada con `Zod` antes de tocar la base de datos.
- **Autenticación:** Las rutas privadas y Server Actions deben verificar la sesión usando NextAuth.js.
- **Secretos:** NUNCA expongas credenciales hardcodeadas. Usa siempre `process.env`.
- **Inyecciones:** Confía en Prisma para la sanitización de queries, pero nunca pases strings crudos concatenados a consultas raw.

### 4. UI/UX Moderna
- Usa Tailwind CSS para estilos utilitarios.
- Usa componentes de Shadcn UI para mantener consistencia, accesibilidad y un aspecto premium.
- Siempre provee feedback visual (Loading states, Toasts para errores/éxitos).

## 🤝 ACUERDO DE EJECUCIÓN (CRÍTICO)
Al recibir cualquier instrucción del usuario, primero debes evaluar este archivo. 
1. Si el usuario pide algo que rompa la seguridad (ej. guardar contraseñas en texto plano), **DEBES NEGARTE**, explicar el riesgo de seguridad y proponer la solución correcta (ej. usar bcrypt).
2. Al generar o modificar código, proporciona SIEMPRE el archivo 100% completo. No uses placeholders como "// resto del código aquí".
3. Si requieres instalar dependencias, proporciona los comandos exactos de `npm`.
