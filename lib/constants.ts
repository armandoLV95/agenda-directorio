// Categorías por defecto del directorio. Son solo una convención de UI (el campo
// `categoria` en la base de datos es texto libre), pensadas para un consultorio
// dental pero genéricas para cualquier negocio de servicios.
export const CATEGORIAS_CONTACTO = {
  PACIENTE: "Paciente",
  PROVEEDOR: "Proveedor",
  LABORATORIO: "Laboratorio",
  ASEGURADORA: "Aseguradora",
  EMPLEADO: "Empleado",
  OTRO: "Otro",
} as const;

export type CategoriaContacto = keyof typeof CATEGORIAS_CONTACTO;

export function labelCategoria(categoria: string): string {
  return CATEGORIAS_CONTACTO[categoria as CategoriaContacto] ?? categoria;
}

export const ESTADOS_CITA = {
  PROGRAMADA: "Programada",
  CONFIRMADA: "Confirmada",
  COMPLETADA: "Completada",
  CANCELADA: "Cancelada",
  NO_ASISTIO: "No asistió",
} as const;

export type EstadoCita = keyof typeof ESTADOS_CITA;

export function labelEstadoCita(estado: string): string {
  return ESTADOS_CITA[estado as EstadoCita] ?? estado;
}

export const ESTADO_CITA_COLOR: Record<string, string> = {
  PROGRAMADA: "bg-sky-100 text-sky-800 border-sky-200",
  CONFIRMADA: "bg-emerald-100 text-emerald-800 border-emerald-200",
  COMPLETADA: "bg-slate-100 text-slate-600 border-slate-200",
  CANCELADA: "bg-red-100 text-red-700 border-red-200 line-through",
  NO_ASISTIO: "bg-amber-100 text-amber-800 border-amber-200",
};

export const ROLES = {
  ADMIN: "ADMIN",
  ASISTENTE: "ASISTENTE",
} as const;

export const ROLES_LABEL: Record<string, string> = {
  ADMIN: "Administrador",
  ASISTENTE: "Asistente",
};
