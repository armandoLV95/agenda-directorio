import Link from "next/link";
import { requireSession } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { labelEstadoCita, ESTADO_CITA_COLOR } from "@/lib/constants";
import { toYMD, fromYMD, sumarDias, formatoHora, formatoFechaLarga, conMayusculaInicial } from "@/lib/fechas";

export default async function DashboardPage() {
  await requireSession();

  const hoy = new Date();
  const inicio = fromYMD(toYMD(hoy));
  const fin = sumarDias(inicio, 1);

  const [citasHoy, totalContactos] = await Promise.all([
    prisma.cita.findMany({
      where: { fechaInicio: { gte: inicio, lt: fin } },
      include: { contacto: true },
      orderBy: { fechaInicio: "asc" },
    }),
    prisma.contacto.count(),
  ]);

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-8 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-teal-900">
            {conMayusculaInicial(formatoFechaLarga(hoy))}
          </h1>
          <p className="text-sm text-slate-500">
            {totalContactos} contacto{totalContactos === 1 ? "" : "s"} en el directorio
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/agenda/nueva?fecha=${toYMD(hoy)}`}
            className="rounded-md bg-teal-800 px-4 py-2 text-sm font-medium text-white hover:bg-teal-900"
          >
            + Nueva cita
          </Link>
          <Link
            href="/directorio/nuevo"
            className="rounded-md border border-teal-800 px-4 py-2 text-sm font-medium text-teal-800 hover:bg-teal-50"
          >
            + Nuevo contacto
          </Link>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-slate-700">Citas de hoy</h2>
          <Link href="/agenda" className="text-sm text-teal-800 underline">
            Ver agenda completa
          </Link>
        </div>

        {citasHoy.length === 0 ? (
          <p className="text-sm text-slate-500 rounded-md border border-dashed border-slate-300 p-6 text-center">
            No hay citas programadas para hoy.
          </p>
        ) : (
          <ul className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
            {citasHoy.map((cita) => (
              <li key={cita.id} className="flex items-center gap-3 px-4 py-3">
                <span className="text-sm font-medium text-slate-700 shrink-0 whitespace-nowrap">
                  {formatoHora(cita.fechaInicio)}–{formatoHora(cita.fechaFin)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{cita.titulo}</p>
                  {cita.contacto && (
                    <p className="text-xs text-slate-500 truncate">{cita.contacto.nombre}</p>
                  )}
                </div>
                <span
                  className={`text-xs rounded-full border px-2 py-0.5 shrink-0 ${ESTADO_CITA_COLOR[cita.estado]}`}
                >
                  {labelEstadoCita(cita.estado)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
