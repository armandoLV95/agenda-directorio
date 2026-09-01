import Link from "next/link";
import { labelEstadoCita, ESTADO_CITA_COLOR } from "@/lib/constants";
import { formatoHora } from "@/lib/fechas";
import type { Cita, Contacto } from "@prisma/client";

export default function CitaItem({ cita }: { cita: Cita & { contacto: Contacto | null } }) {
  return (
    <Link
      href={`/agenda/${cita.id}/editar`}
      className="flex items-start gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 hover:border-teal-300 hover:bg-teal-50/50"
    >
      <span className="text-xs font-medium text-slate-500 shrink-0 pt-0.5 whitespace-nowrap">
        {formatoHora(cita.fechaInicio)}–{formatoHora(cita.fechaFin)}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">{cita.titulo}</p>
        {cita.contacto && <p className="text-xs text-slate-500 truncate">{cita.contacto.nombre}</p>}
        {cita.notas && <p className="text-xs text-slate-400 truncate">{cita.notas}</p>}
      </div>
      <span
        className={`text-[10px] rounded-full border px-1.5 py-0.5 shrink-0 ${ESTADO_CITA_COLOR[cita.estado]}`}
      >
        {labelEstadoCita(cita.estado)}
      </span>
    </Link>
  );
}
