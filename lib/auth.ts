import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import authConfig from "@/lib/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      id: "local-login",
      name: "Correo y contraseña",
      credentials: {
        email: { label: "Correo o usuario", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const identificador = credentials?.email;
        const password = credentials?.password;
        if (
          typeof identificador !== "string" ||
          typeof password !== "string" ||
          !identificador ||
          !password
        ) {
          return null;
        }
        const usuario = await prisma.usuario.findFirst({
          where: { OR: [{ email: identificador }, { username: identificador }] },
        });
        if (!usuario || !usuario.activo) return null;
        const valido = await bcrypt.compare(password, usuario.passwordHash);
        if (!valido) return null;
        return { id: usuario.id, email: usuario.email, name: usuario.name, role: usuario.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.usuarioId = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.usuarioId as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
