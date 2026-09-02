"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/authz";
import { formatoHora } from "@/lib/fechas";

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

// Dos citas se encuentran si una empieza antes de que la otra termine y viceversa.
// Las canceladas no cuentan: liberan su horario para agendar algo mas.
async function buscarConflicto(fechaInicio: Date, fechaFin: Date, excluirCitaId?: string) {
  return prisma.cita.findFirst({
    where: {
      id: excluirCitaId ? { not: excluirCitaId } : undefined,
      estado: { not: "CANCELADA" },
      fechaInicio: { lt: fechaFin },
      fechaFin: { gt: fechaInicio },
    },
  });
}

function mensajeConflicto(conflicto: { titulo: string; fechaInicio: Date; fechaFin: Date }): FormState {
  return {
    error: `Ya hay una cita agendada de ${formatoHora(conflicto.fechaInicio)} a ${formatoHora(conflicto.fechaFin)} (${conflicto.titulo}). Elige otro horario.`,
  };
}

export async function crearCita(_prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await requireSession();
  const campos = leerCampos(formData);
  const error = validar(campos);
  if (error) return error;

  const fechaInicio = combinarFechaHora(campos.fecha, campos.horaInicio);
  const fechaFin = combinarFechaHora(campos.fecha, campos.horaFin);
  const conflicto = await buscarConflicto(fechaInicio, fechaFin);
  if (conflicto) return mensajeConflicto(conflicto);

  await prisma.cita.create({
    data: {
      titulo: campos.titulo,
      fechaInicio,
      fechaFin,
      contactoId: campos.contactoId,
      notas: campos.notas,
      creadoPorId: session.user.id,
      actualizadoPorId: session.user.id,
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
  const session = await requireSession();
  const campos = leerCampos(formData);
  const error = validar(campos);
  if (error) return error;

  const fechaInicio = combinarFechaHora(campos.fecha, campos.horaInicio);
  const fechaFin = combinarFechaHora(campos.fecha, campos.horaFin);
  const conflicto = await buscarConflicto(fechaInicio, fechaFin, citaId);
  if (conflicto) return mensajeConflicto(conflicto);

  await prisma.cita.update({
    where: { id: citaId },
    data: {
      titulo: campos.titulo,
      fechaInicio,
      fechaFin,
      contactoId: campos.contactoId,
      notas: campos.notas,
      actualizadoPorId: session.user.id,
    },
  });

  revalidatePath("/agenda");
  redirect(`/agenda?vista=dia&fecha=${campos.fecha}`);
}

export async function actualizarEstadoCita(citaId: string, fecha: string, formData: FormData) {
  const session = await requireSession();
  const estado = String(formData.get("estado") ?? "");
  await prisma.cita.update({
    where: { id: citaId },
    data: { estado, actualizadoPorId: session.user.id },
  });
  revalidatePath("/agenda");
  redirect(`/agenda?vista=dia&fecha=${fecha}`);
}

export async function eliminarCita(citaId: string, fecha: string) {
  await requireSession();
  await prisma.cita.delete({ where: { id: citaId } });
  revalidatePath("/agenda");
  redirect(`/agenda?vista=dia&fecha=${fecha}`);
}
