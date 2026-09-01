import Link from "next/link";
import { ESTADO_CITA_COLOR } from "@/lib/constants";
import { formatoHora, minutosDelDia } from "@/lib/fechas";
import { MINUTO_INICIO_GRID, PX_POR_MINUTO } from "@/lib/agendaGrid";
import type { Cita, Contacto } from "@prisma/client";

const ALTURA_MINIMA = 24;

export default function CitaBloque({ cita }: { cita: Cita & { contacto: Contacto | null } }) {
  const inicioMin = minutosDelDia(cita.fechaInicio) - MINUTO_INICIO_GRID;
  const duracionMin = Math.max(
    (cita.fechaFin.getTime() - cita.fechaInicio.getTime()) / 60000,
    1
  );
  const top = inicioMin * PX_POR_MINUTO;
  const height = Math.max(duracionMin * PX_POR_MINUTO, ALTURA_MINIMA);

  return (
    <Link
      href={`/agenda/${cita.id}/editar`}
      style={{ top, height }}
      className={`absolute left-1 right-1 pointer-events-auto rounded-md border px-2 py-0.5 overflow-hidden shadow-sm hover:brightness-95 ${ESTADO_CITA_COLOR[cita.estado]}`}
    >
      <p className="text-xs font-semibold truncate leading-tight">{cita.titulo}</p>
      <p className="text-[10px] leading-tight opacity-80">
        {formatoHora(cita.fechaInicio)}–{formatoHora(cita.fechaFin)}
      </p>
      {cita.contacto && (
        <p className="text-[10px] leading-tight truncate opacity-80">{cita.contacto.nombre}</p>
      )}
      {cita.notas && (
        <p className="text-[10px] leading-tight truncate opacity-70">{cita.notas}</p>
      )}
    </Link>
  );
}
