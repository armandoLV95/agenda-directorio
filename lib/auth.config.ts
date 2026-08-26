import type { NextAuthConfig } from "next-auth";

// Configuración sin Prisma/bcrypt, para que el middleware (Edge Runtime) se mantenga
// ligero. La lógica de inicio de sesión (que sí necesita Prisma) vive en lib/auth.ts.
export default {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
} satisfies NextAuthConfig;
