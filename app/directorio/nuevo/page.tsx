import Link from "next/link";
import { requireSession } from "@/lib/authz";
import { crearContacto } from "@/lib/actions/directorio";
import ContactoForm from "@/components/ContactoForm";

export default async function NuevoContactoPage() {
  await requireSession();

  return (
    <div className="max-w-lg mx-auto w-full px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-teal-900">Nuevo contacto</h1>
        <Link href="/directorio" className="text-sm text-slate-500 hover:text-slate-700">
          Cancelar
        </Link>
      </div>

      <ContactoForm accion={crearContacto} textoBoton="Crear contacto" />
    </div>
  );
}
