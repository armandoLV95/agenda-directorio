"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/authz";

export type FormState = { error: string } | null;

function campoTexto(formData: FormData, campo: string): string | null {
  const valor = String(formData.get(campo) ?? "").trim();
  return valor || null;
}

export async function crearContacto(_prevState: FormState, formData: FormData): Promise<FormState> {
  await requireSession();
  const nombre = campoTexto(formData, "nombre");
  if (!nombre) return { error: "El nombre es obligatorio" };

  const contacto = await prisma.contacto.create({
    data: {
      nombre,
      categoria: campoTexto(formData, "categoria") ?? "OTRO",
      telefono: campoTexto(formData, "telefono"),
      telefono2: campoTexto(formData, "telefono2"),
      email: campoTexto(formData, "email"),
      direccion: campoTexto(formData, "direccion"),
      notas: campoTexto(formData, "notas"),
    },
  });

  revalidatePath("/directorio");
  redirect(`/directorio/${contacto.id}`);
}

export async function actualizarContacto(
  contactoId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireSession();
  const nombre = campoTexto(formData, "nombre");
  if (!nombre) return { error: "El nombre es obligatorio" };

  await prisma.contacto.update({
    where: { id: contactoId },
    data: {
      nombre,
      categoria: campoTexto(formData, "categoria") ?? "OTRO",
      telefono: campoTexto(formData, "telefono"),
      telefono2: campoTexto(formData, "telefono2"),
      email: campoTexto(formData, "email"),
      direccion: campoTexto(formData, "direccion"),
      notas: campoTexto(formData, "notas"),
    },
  });

  revalidatePath("/directorio");
  revalidatePath(`/directorio/${contactoId}`);
  redirect(`/directorio/${contactoId}`);
}

export async function eliminarContacto(contactoId: string) {
  await requireSession();
  const tieneCitas = await prisma.cita.count({ where: { contactoId } });
  if (tieneCitas > 0) {
    throw new Error("No se puede eliminar: el contacto tiene citas registradas en la agenda");
  }
  await prisma.contacto.delete({ where: { id: contactoId } });
  revalidatePath("/directorio");
  redirect("/directorio");
}
