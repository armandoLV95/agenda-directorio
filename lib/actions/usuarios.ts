"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authz";
import { ROLES } from "@/lib/constants";

export type FormState = { error: string } | null;

export async function crearUsuario(_prevState: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const username = String(formData.get("username") ?? "").trim() || null;
  const name = String(formData.get("name") ?? "").trim() || null;
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "") === ROLES.ADMIN ? ROLES.ADMIN : ROLES.ASISTENTE;

  if (!email || !email.includes("@")) return { error: "Ingresa un correo válido." };
  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres." };

  const existente = await prisma.usuario.findFirst({
    where: { OR: [{ email }, ...(username ? [{ username }] : [])] },
  });
  if (existente) return { error: "Ya existe una cuenta con ese correo o usuario." };

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.usuario.create({ data: { email, username, name, passwordHash, role } });

  revalidatePath("/usuarios");
  return null;
}

export async function cambiarRolUsuario(usuarioId: string, formData: FormData) {
  const session = await requireAdmin();
  if (session.user.id === usuarioId) {
    throw new Error("No puedes cambiar tu propio rol.");
  }
  const role = String(formData.get("role") ?? "") === ROLES.ADMIN ? ROLES.ADMIN : ROLES.ASISTENTE;
  await prisma.usuario.update({ where: { id: usuarioId }, data: { role } });
  revalidatePath("/usuarios");
}

export async function cambiarPasswordUsuario(usuarioId: string, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres." };

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.usuario.update({ where: { id: usuarioId }, data: { passwordHash } });
  revalidatePath("/usuarios");
  return null;
}

export async function eliminarUsuario(usuarioId: string) {
  const session = await requireAdmin();
  if (session.user.id === usuarioId) {
    throw new Error("No puedes eliminar tu propia cuenta.");
  }
  await prisma.usuario.delete({ where: { id: usuarioId } });
  revalidatePath("/usuarios");
}
