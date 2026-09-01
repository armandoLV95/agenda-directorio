import Link from "next/link";
import { ESTADO_CITA_COLOR } from "@/lib/constants";
import { formatoHora } from "@/lib/fechas";
import type { Cita, Contacto } from "@prisma/client";

export default function CitaItem({ cita }: { cita: Cita & { contacto: Contacto | null } }) {
  return (
    <Link
      href={`/agenda/${cita.id}/editar`}
      className={`block w-full min-w-0 rounded-md border px-2 py-1.5 hover:brightness-95 ${ESTADO_CITA_COLOR[cita.estado]}`}
    >
      <p className="text-[11px] font-medium whitespace-nowrap">
        {formatoHora(cita.fechaInicio)}–{formatoHora(cita.fechaFin)}
      </p>
      <p className="text-xs font-semibold truncate">{cita.titulo}</p>
      {cita.contacto && <p className="text-[11px] truncate opacity-80">{cita.contacto.nombre}</p>}
      {cita.notas && <p className="text-[11px] truncate opacity-70">{cita.notas}</p>}
    </Link>
  );
}
