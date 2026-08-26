import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { actualizarContacto } from "@/lib/actions/directorio";
import ContactoForm from "@/components/ContactoForm";

export default async function EditarContactoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSession();
  const { id } = await params;

  const contacto = await prisma.contacto.findUnique({ where: { id } });
  if (!contacto) notFound();

  return (
    <div className="max-w-lg mx-auto w-full px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-teal-900">Editar contacto</h1>
        <Link href={`/directorio/${contacto.id}`} className="text-sm text-slate-500 hover:text-slate-700">
          Cancelar
        </Link>
      </div>

      <ContactoForm
        accion={actualizarContacto.bind(null, contacto.id)}
        textoBoton="Guardar cambios"
        valoresIniciales={{
          nombre: contacto.nombre,
          categoria: contacto.categoria,
          telefono: contacto.telefono ?? undefined,
          telefono2: contacto.telefono2 ?? undefined,
          email: contacto.email ?? undefined,
          direccion: contacto.direccion ?? undefined,
          notas: contacto.notas ?? undefined,
        }}
      />
    </div>
  );
}
