import Link from "next/link";
import { requireSession } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { crearCita } from "@/lib/actions/agenda";
import CitaForm from "@/components/CitaForm";
import { toYMD } from "@/lib/fechas";

export default async function NuevaCitaPage({
  searchParams,
}: {
  searchParams: Promise<{ fecha?: string; contactoId?: string }>;
}) {
  await requireSession();
  const params = await searchParams;
  const contactos = await prisma.contacto.findMany({ orderBy: { nombre: "asc" } });

  return (
    <div className="max-w-lg mx-auto w-full px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-teal-900">Nueva cita</h1>
        <Link href="/agenda" className="text-sm text-slate-500 hover:text-slate-700">
          Cancelar
        </Link>
      </div>

      <CitaForm
        accion={crearCita}
        contactos={contactos}
        textoBoton="Crear cita"
        valoresIniciales={{
          fecha: params.fecha ?? toYMD(new Date()),
          contactoId: params.contactoId,
        }}
      />
    </div>
  );
}
