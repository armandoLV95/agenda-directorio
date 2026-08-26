import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { actualizarCita, actualizarEstadoCita, eliminarCita } from "@/lib/actions/agenda";
import CitaForm from "@/components/CitaForm";
import ConfirmarBoton from "@/components/ConfirmarBoton";
import { ESTADOS_CITA } from "@/lib/constants";
import { toYMD, toHM } from "@/lib/fechas";

export default async function EditarCitaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSession();
  const { id } = await params;

  const [cita, contactos] = await Promise.all([
    prisma.cita.findUnique({ where: { id } }),
    prisma.contacto.findMany({ orderBy: { nombre: "asc" } }),
  ]);
  if (!cita) notFound();

  const fecha = toYMD(cita.fechaInicio);

  return (
    <div className="max-w-lg mx-auto w-full px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-teal-900">Editar cita</h1>
        <Link href={`/agenda?vista=dia&fecha=${fecha}`} className="text-sm text-slate-500 hover:text-slate-700">
          Cancelar
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(ESTADOS_CITA).map(([valor, label]) => (
          <form key={valor} action={actualizarEstadoCita.bind(null, cita.id, fecha)}>
            <input type="hidden" name="estado" value={valor} />
            <button
              type="submit"
              disabled={cita.estado === valor}
              className="text-xs rounded-full border border-slate-300 px-3 py-1 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-default"
            >
              {label}
            </button>
          </form>
        ))}
      </div>

      <CitaForm
        accion={actualizarCita.bind(null, cita.id)}
        contactos={contactos}
        textoBoton="Guardar cambios"
        valoresIniciales={{
          titulo: cita.titulo,
          fecha,
          horaInicio: toHM(cita.fechaInicio),
          horaFin: toHM(cita.fechaFin),
          contactoId: cita.contactoId ?? undefined,
          notas: cita.notas ?? undefined,
        }}
      />

      <form action={eliminarCita.bind(null, cita.id, fecha)} className="pt-2 border-t border-slate-200">
        <ConfirmarBoton
          mensaje="¿Eliminar esta cita? Esta acción no se puede deshacer."
          className="text-sm text-red-600 hover:text-red-800 underline"
        >
          Eliminar cita
        </ConfirmarBoton>
      </form>
    </div>
  );
}
