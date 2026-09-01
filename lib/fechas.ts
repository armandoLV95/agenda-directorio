const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export function toYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromYMD(ymd: string): Date {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function sumarDias(d: Date, dias: number): Date {
  const copia = new Date(d);
  copia.setDate(copia.getDate() + dias);
  return copia;
}

export function inicioSemana(d: Date): Date {
  const copia = new Date(d);
  copia.setDate(copia.getDate() - copia.getDay());
  copia.setHours(0, 0, 0, 0);
  return copia;
}

export function inicioMes(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function inicioCuadriculaMes(d: Date): Date {
  return inicioSemana(inicioMes(d));
}

export function esMismoDia(a: Date, b: Date): boolean {
  return toYMD(a) === toYMD(b);
}

export function esMismoMes(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function nombreDiaCorto(d: Date): string {
  return DIAS_SEMANA[d.getDay()];
}

export function nombreMes(d: Date): string {
  return MESES[d.getMonth()];
}

export function minutosDelDia(d: Date): number {
  return d.getHours() * 60 + d.getMinutes();
}

export function sumarMinutosHM(hm: string, minutos: number): string {
  const [h, m] = hm.split(":").map(Number);
  const total = (h * 60 + m + minutos + 24 * 60) % (24 * 60);
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export function toHM(d: Date): string {
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export function formatoHora(d: Date): string {
  return d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
}

export function formatoFechaLarga(d: Date): string {
  return d.toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Los nombres de día/mes en español van en minúsculas salvo al iniciar una oración
// o encabezado — a diferencia del inglés, no se capitaliza cada palabra.
export function conMayusculaInicial(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
