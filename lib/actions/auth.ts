"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type FormState = { error: string } | null;

export async function loginConCredenciales(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get("email");
  const password = formData.get("password");
  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return { error: "Ingresa tu correo o usuario y tu contraseña." };
  }

  try {
    await signIn("local-login", { email, password, redirectTo: "/" });
  } catch (e) {
    if (e instanceof AuthError) {
      return { error: "Correo/usuario o contraseña incorrectos." };
    }
    // NEXT_REDIRECT (login exitoso) no es un AuthError: hay que dejarlo pasar.
    throw e;
  }
  return null;
}

export async function registrarUsuario(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const username = String(formData.get("username") ?? "").trim() || null;
  const name = String(formData.get("name") ?? "").trim() || null;
  const password = String(formData.get("password") ?? "");

  if (!email || !email.includes("@")) return { error: "Ingresa un correo válido." };
  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres." };

  const existente = await prisma.usuario.findFirst({
    where: { OR: [{ email }, ...(username ? [{ username }] : [])] },
  });
  if (existente) return { error: "Ya existe una cuenta con ese correo o usuario." };

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.usuario.create({ data: { email, username, name, passwordHash } });

  try {
    await signIn("local-login", { email, password, redirectTo: "/" });
  } catch (e) {
    if (e instanceof AuthError) {
      return { error: "Cuenta creada, pero no se pudo iniciar sesión. Intenta entrar manualmente." };
    }
    throw e;
  }
  return null;
}
