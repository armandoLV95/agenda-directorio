import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { eliminarContacto } from "@/lib/actions/directorio";
import { labelCategoria, labelEstadoCita, ESTADO_CITA_COLOR } from "@/lib/constants";
import { formatoHora, formatoFechaLarga } from "@/lib/fechas";
import ConfirmarBoton from "@/components/ConfirmarBoton";

export default async function DetalleContactoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSession();
  const { id } = await params;

  const contacto = await prisma.contacto.findUnique({
    where: { id },
    include: { citas: { orderBy: { fechaInicio: "desc" } } },
  });
  if (!contacto) notFound();

  const ahora = new Date();
  const proximas = contacto.citas.filter((c) => c.fechaInicio >= ahora).reverse();
  const pasadas = contacto.citas.filter((c) => c.fechaInicio < ahora);

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-8 space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-teal-900">{contacto.nombre}</h1>
          <span className="text-xs rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-slate-600">
            {labelCategoria(contacto.categoria)}
          </span>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/agenda/nueva?contactoId=${contacto.id}`}
            className="rounded-md bg-teal-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-900"
          >
            + Agendar cita
          </Link>
          <Link
            href={`/directorio/${contacto.id}/editar`}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
          >
            Editar
          </Link>
        </div>
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-4 space-y-1 text-sm">
        <p>
          <span className="text-slate-500">Teléfono: </span>
          {contacto.telefono ?? "—"}
          {contacto.telefono2 ? ` / ${contacto.telefono2}` : ""}
        </p>
        <p>
          <span className="text-slate-500">Correo: </span>
          {contacto.email ?? "—"}
        </p>
        <p>
          <span className="text-slate-500">Dirección: </span>
          {contacto.direccion ?? "—"}
        </p>
        {contacto.notas && (
          <p className="pt-2 border-t border-slate-100 whitespace-pre-wrap">
            <span className="text-slate-500">Notas: </span>
            {contacto.notas}
          </p>
        )}
      </div>

      <section className="space-y-2">
        <h2 className="font-medium text-slate-700">Próximas citas</h2>
        {proximas.length === 0 ? (
          <p className="text-sm text-slate-400">Sin citas próximas.</p>
        ) : (
          <ul className="space-y-1.5">
            {proximas.map((cita) => (
              <li key={cita.id}>
                <Link
                  href={`/agenda/${cita.id}/editar`}
                  className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm hover:border-teal-300"
                >
                  <span className="text-slate-500 shrink-0">
                    {formatoFechaLarga(cita.fechaInicio)}, {formatoHora(cita.fechaInicio)}
                  </span>
                  <span className="flex-1 truncate">{cita.titulo}</span>
                  <span className={`text-[10px] rounded-full border px-1.5 py-0.5 shrink-0 ${ESTADO_CITA_COLOR[cita.estado]}`}>
                    {labelEstadoCita(cita.estado)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="font-medium text-slate-700">Historial</h2>
        {pasadas.length === 0 ? (
          <p className="text-sm text-slate-400">Sin citas anteriores.</p>
        ) : (
          <ul className="space-y-1.5">
            {pasadas.map((cita) => (
              <li key={cita.id}>
                <Link
                  href={`/agenda/${cita.id}/editar`}
                  className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm hover:border-teal-300"
                >
                  <span className="text-slate-500 shrink-0">
                    {formatoFechaLarga(cita.fechaInicio)}, {formatoHora(cita.fechaInicio)}
                  </span>
                  <span className="flex-1 truncate">{cita.titulo}</span>
                  <span className={`text-[10px] rounded-full border px-1.5 py-0.5 shrink-0 ${ESTADO_CITA_COLOR[cita.estado]}`}>
                    {labelEstadoCita(cita.estado)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {contacto.citas.length === 0 && (
        <form action={eliminarContacto.bind(null, contacto.id)} className="pt-2 border-t border-slate-200">
          <ConfirmarBoton
            mensaje="¿Eliminar este contacto? Esta acción no se puede deshacer."
            className="text-sm text-red-600 hover:text-red-800 underline"
          >
            Eliminar contacto
          </ConfirmarBoton>
        </form>
      )}
    </div>
  );
}
