import Link from "next/link";
import CitaBloque from "@/components/CitaBloque";
import { HORA_INICIO_GRID, HORA_FIN_GRID, PX_POR_HORA, ALTURA_GRID } from "@/lib/agendaGrid";
import { toYMD } from "@/lib/fechas";
import type { Cita, Contacto } from "@prisma/client";

export default function AgendaGridDia({
  fecha,
  citas,
}: {
  fecha: Date;
  citas: (Cita & { contacto: Contacto | null })[];
}) {
  const fechaStr = toYMD(fecha);
  const horas = Array.from(
    { length: HORA_FIN_GRID - HORA_INICIO_GRID },
    (_, i) => HORA_INICIO_GRID + i
  );

  return (
    <div className="relative rounded-md border border-slate-200 bg-white">
      {horas.map((hora) => (
        <div key={hora} className="flex border-t border-slate-100 first:border-t-0">
          <div className="w-14 shrink-0 text-right pr-2 pt-0.5">
            <span className="text-xs text-slate-400">{String(hora).padStart(2, "0")}:00</span>
          </div>
          <div className="flex-1 relative" style={{ height: PX_POR_HORA }}>
            <Link
              href={`/agenda/nueva?fecha=${fechaStr}&hora=${String(hora).padStart(2, "0")}:00`}
              className="absolute inset-x-0 top-0 h-1/2 border-b border-dashed border-slate-100 hover:bg-teal-50/60"
              aria-label={`Nueva cita a las ${hora}:00`}
            />
            <Link
              href={`/agenda/nueva?fecha=${fechaStr}&hora=${String(hora).padStart(2, "0")}:30`}
              className="absolute inset-x-0 bottom-0 h-1/2 hover:bg-teal-50/60"
              aria-label={`Nueva cita a las ${hora}:30`}
            />
          </div>
        </div>
      ))}

      <div
        className="absolute top-0 left-14 right-0 pointer-events-none"
        style={{ height: ALTURA_GRID }}
      >
        {citas.map((cita) => (
          <CitaBloque key={cita.id} cita={cita} />
        ))}
      </div>
    </div>
  );
}
