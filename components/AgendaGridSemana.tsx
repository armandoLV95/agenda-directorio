import Link from "next/link";
import CitaBloque from "@/components/CitaBloque";
import { HORA_INICIO_GRID, HORA_FIN_GRID, PX_POR_HORA, ALTURA_GRID } from "@/lib/agendaGrid";
import { toYMD, esMismoDia, nombreDiaCorto, diaDelMes } from "@/lib/fechas";
import type { Cita, Contacto } from "@prisma/client";

type CitaConContacto = Cita & { contacto: Contacto | null };

export default function AgendaGridSemana({
  dias,
  citas,
}: {
  dias: Date[];
  citas: CitaConContacto[];
}) {
  const horas = Array.from(
    { length: HORA_FIN_GRID - HORA_INICIO_GRID },
    (_, i) => HORA_INICIO_GRID + i
  );
  const hoy = new Date();
  const columnas = `56px repeat(${dias.length}, minmax(110px, 1fr))`;

  return (
    <div className="overflow-x-auto">
      <div
        className="grid rounded-md border border-slate-200 bg-white"
        style={{ gridTemplateColumns: columnas, minWidth: 56 + dias.length * 110 }}
      >
        <div />
        {dias.map((dia) => {
          const esHoy = esMismoDia(dia, hoy);
          return (
            <Link
              key={`enc-${toYMD(dia)}`}
              href={`/agenda?vista=dia&fecha=${toYMD(dia)}`}
              className={`border-l border-slate-100 px-1 py-1.5 text-center text-xs font-medium ${
                esHoy ? "bg-teal-800 text-white" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {nombreDiaCorto(dia)} {diaDelMes(dia)}
            </Link>
          );
        })}

        <div className="relative" style={{ height: ALTURA_GRID }}>
          {horas.map((hora) => (
            <div
              key={hora}
              style={{ height: PX_POR_HORA }}
              className="border-t border-slate-100 first:border-t-0 text-right pr-2 pt-0.5"
            >
              <span className="text-[11px] text-slate-400">{String(hora).padStart(2, "0")}:00</span>
            </div>
          ))}
        </div>

        {dias.map((dia) => {
          const fechaStr = toYMD(dia);
          const citasDia = citas.filter((c) => esMismoDia(c.fechaInicio, dia));
          return (
            <div
              key={fechaStr}
              className="relative border-l border-slate-100"
              style={{ height: ALTURA_GRID }}
            >
              {horas.map((hora) => (
                <div
                  key={hora}
                  style={{ height: PX_POR_HORA }}
                  className="relative border-t border-slate-100 first:border-t-0"
                >
                  <Link
                    href={`/agenda/nueva?fecha=${fechaStr}&hora=${String(hora).padStart(2, "0")}:00`}
                    className="absolute inset-x-0 top-0 h-1/2 border-b border-dashed border-slate-100 hover:bg-teal-50/60"
                    aria-label={`Nueva cita ${fechaStr} ${hora}:00`}
                  />
                  <Link
                    href={`/agenda/nueva?fecha=${fechaStr}&hora=${String(hora).padStart(2, "0")}:30`}
                    className="absolute inset-x-0 bottom-0 h-1/2 hover:bg-teal-50/60"
                    aria-label={`Nueva cita ${fechaStr} ${hora}:30`}
                  />
                </div>
              ))}
              <div className="absolute inset-0 pointer-events-none">
                {citasDia.map((cita) => (
                  <CitaBloque key={cita.id} cita={cita} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
