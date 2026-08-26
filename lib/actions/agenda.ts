"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/authz";

export type FormState = { error: string } | null;

function combinarFechaHora(fecha: string, hora: string): Date {
  const [h, m] = hora.split(":").map(Number);
  const dt = new Date(`${fecha}T00:00:00`);
  dt.setHours(h, m, 0, 0);
  return dt;
}

function leerCampos(formData: FormData) {
  const titulo = String(formData.get("titulo") ?? "").trim();
  const fecha = String(formData.get("fecha") ?? "");
  const horaInicio = String(formData.get("horaInicio") ?? "");
  const horaFin = String(formData.get("horaFin") ?? "");
  const contactoId = String(formData.get("contactoId") ?? "").trim() || null;
  const notas = String(formData.get("notas") ?? "").trim() || null;
  return { titulo, fecha, horaInicio, horaFin, contactoId, notas };
}

function validar(campos: ReturnType<typeof leerCampos>): FormState {
  if (!campos.titulo) return { error: "El título es obligatorio" };
  if (!campos.fecha || !campos.horaInicio || !campos.horaFin) {
    return { error: "Fecha y horario son obligatorios" };
  }
  const inicio = combinarFechaHora(campos.fecha, campos.horaInicio);
  const fin = combinarFechaHora(campos.fecha, campos.horaFin);
  if (fin <= inicio) return { error: "La hora de fin debe ser posterior a la de inicio" };
  return null;
}

export async function crearCita(_prevState: FormState, formData: FormData): Promise<FormState> {
  await requireSession();
  const campos = leerCampos(formData);
  const error = validar(campos);
  if (error) return error;

  await prisma.cita.create({
    data: {
      titulo: campos.titulo,
      fechaInicio: combinarFechaHora(campos.fecha, campos.horaInicio),
      fechaFin: combinarFechaHora(campos.fecha, campos.horaFin),
      contactoId: campos.contactoId,
      notas: campos.notas,
    },
  });

  revalidatePath("/agenda");
  redirect(`/agenda?vista=dia&fecha=${campos.fecha}`);
}

export async function actualizarCita(
  citaId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireSession();
  const campos = leerCampos(formData);
  const error = validar(campos);
  if (error) return error;

  await prisma.cita.update({
    where: { id: citaId },
    data: {
      titulo: campos.titulo,
      fechaInicio: combinarFechaHora(campos.fecha, campos.horaInicio),
      fechaFin: combinarFechaHora(campos.fecha, campos.horaFin),
      contactoId: campos.contactoId,
      notas: campos.notas,
    },
  });

  revalidatePath("/agenda");
  redirect(`/agenda?vista=dia&fecha=${campos.fecha}`);
}

export async function actualizarEstadoCita(citaId: string, fecha: string, formData: FormData) {
  await requireSession();
  const estado = String(formData.get("estado") ?? "");
  await prisma.cita.update({ where: { id: citaId }, data: { estado } });
  revalidatePath("/agenda");
  redirect(`/agenda?vista=dia&fecha=${fecha}`);
}

export async function eliminarCita(citaId: string, fecha: string) {
  await requireSession();
  await prisma.cita.delete({ where: { id: citaId } });
  revalidatePath("/agenda");
  redirect(`/agenda?vista=dia&fecha=${fecha}`);
}
