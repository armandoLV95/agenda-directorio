// Todas las fechas/horas del negocio se manejan en esta zona horaria, sin importar
// en qué servidor corra realmente la app (en Vercel el servidor corre en UTC, no en
// la hora de Tijuana). Si el negocio estuviera en otra zona, ajustar solo esta constante.
const ZONA_HORARIA = "America/Tijuana";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const DIAS_SEMANA_INDICE: Record<string, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
};

// Descompone un instante en año/mes/día/hora/minuto/segundo/día-de-semana, leyendo
// el reloj de pared que marcaría en ZONA_HORARIA (no en la zona del servidor).
function partesEnZona(d: Date) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: ZONA_HORARIA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "short",
    hour12: false,
  });
  const p: Record<string, string> = {};
  for (const { type, value } of fmt.formatToParts(d)) p[type] = value;
  return {
    year: Number(p.year),
    month: Number(p.month),
    day: Number(p.day),
    // La hora "24" (medianoche exacta) algunos motores la representan como "24" en vez de "00".
    hour: p.hour === "24" ? 0 : Number(p.hour),
    minute: Number(p.minute),
    second: Number(p.second),
    diaSemana: DIAS_SEMANA_INDICE[p.weekday] ?? 0,
  };
}

// Construye el instante (UTC real) que corresponde a esa fecha/hora de pared en
// ZONA_HORARIA. Es la operación inversa de partesEnZona.
function zonaAUtc(year: number, month: number, day: number, hour = 0, minute = 0, second = 0): Date {
  const comoUtc = Date.UTC(year, month - 1, day, hour, minute, second);
  const partes = partesEnZona(new Date(comoUtc));
  const comoSiFueraUtc = Date.UTC(partes.year, partes.month - 1, partes.day, partes.hour, partes.minute, partes.second);
  const diferencia = comoSiFueraUtc - comoUtc;
  return new Date(comoUtc - diferencia);
}

// Convierte "YYYY-MM-DD" + "HH:MM" (tal como los captura el formulario) al instante
// real que representan en la hora del negocio.
export function fechaHoraAInstante(fecha: string, hora: string): Date {
  const [y, m, d] = fecha.split("-").map(Number);
  const [h, min] = hora.split(":").map(Number);
  return zonaAUtc(y, m, d, h, min, 0);
}

export function toYMD(d: Date): string {
  const { year, month, day } = partesEnZona(d);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function fromYMD(ymd: string): Date {
  const [y, m, d] = ymd.split("-").map(Number);
  return zonaAUtc(y, m ?? 1, d ?? 1);
}

export function sumarDias(d: Date, dias: number): Date {
  const { year, month, day, hour, minute, second } = partesEnZona(d);
  // Date.UTC normaliza automáticamente si "day + dias" se sale del rango del mes.
  const base = new Date(Date.UTC(year, month - 1, day + dias));
  return zonaAUtc(base.getUTCFullYear(), base.getUTCMonth() + 1, base.getUTCDate(), hour, minute, second);
}

export function inicioSemana(d: Date): Date {
  const { year, month, day, diaSemana } = partesEnZona(d);
  return sumarDias(zonaAUtc(year, month, day), -diaSemana);
}

export function inicioMes(d: Date): Date {
  const { year, month } = partesEnZona(d);
  return zonaAUtc(year, month, 1);
}

export function inicioCuadriculaMes(d: Date): Date {
  return inicioSemana(inicioMes(d));
}

export function esMismoDia(a: Date, b: Date): boolean {
  return toYMD(a) === toYMD(b);
}

export function esMismoMes(a: Date, b: Date): boolean {
  const pa = partesEnZona(a);
  const pb = partesEnZona(b);
  return pa.year === pb.year && pa.month === pb.month;
}

export function nombreDiaCorto(d: Date): string {
  return d.toLocaleDateString("es-MX", { weekday: "short", timeZone: ZONA_HORARIA });
}

export function nombreMes(d: Date): string {
  return MESES[partesEnZona(d).month - 1];
}

export function minutosDelDia(d: Date): number {
  const { hour, minute } = partesEnZona(d);
  return hour * 60 + minute;
}

export function sumarMinutosHM(hm: string, minutos: number): string {
  const [h, m] = hm.split(":").map(Number);
  const total = (h * 60 + m + minutos + 24 * 60) % (24 * 60);
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

// Etiqueta de una hora en punto (0-23) en formato de 12 horas, para las cabeceras
// de la cuadricula de la agenda (ej. 17 -> "5:00 p.m.").
export function etiquetaHora12(hora: number): string {
  const periodo = hora >= 12 ? "p.m." : "a.m.";
  let hora12 = hora % 12;
  if (hora12 === 0) hora12 = 12;
  return `${hora12}:00 ${periodo}`;
}

export function toHM(d: Date): string {
  const { hour, minute } = partesEnZona(d);
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function formatoHora(d: Date): string {
  return d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", timeZone: ZONA_HORARIA });
}

export function formatoFechaLarga(d: Date): string {
  return d.toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: ZONA_HORARIA,
  });
}

export function anioEnZona(d: Date): number {
  return partesEnZona(d).year;
}

export function diaDelMes(d: Date): number {
  return partesEnZona(d).day;
}

// Los nombres de día/mes en español van en minúsculas salvo al iniciar una oración
// o encabezado — a diferencia del inglés, no se capitaliza cada palabra.
export function conMayusculaInicial(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
