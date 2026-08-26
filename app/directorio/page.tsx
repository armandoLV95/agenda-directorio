import Link from "next/link";
import { requireSession } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { CATEGORIAS_CONTACTO, labelCategoria } from "@/lib/constants";
import type { Prisma } from "@prisma/client";

export default async function DirectorioPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string }>;
}) {
  await requireSession();
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const categoria = params.categoria ?? "";

  const where: Prisma.ContactoWhereInput = {
    ...(categoria ? { categoria } : {}),
    ...(q
      ? {
          OR: [
            { nombre: { contains: q } },
            { telefono: { contains: q } },
            { telefono2: { contains: q } },
            { email: { contains: q } },
          ],
        }
      : {}),
  };

  const contactos = await prisma.contacto.findMany({ where, orderBy: { nombre: "asc" } });

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-semibold text-teal-900">Directorio</h1>
        <Link
          href="/directorio/nuevo"
          className="rounded-md bg-teal-800 px-4 py-2 text-sm font-medium text-white hover:bg-teal-900"
        >
          + Nuevo contacto
        </Link>
      </div>

      <form className="flex flex-wrap gap-2" action="/directorio">
        <input
          name="q"
          type="text"
          defaultValue={q}
          placeholder="Buscar por nombre, teléfono o correo..."
          className="flex-1 min-w-[12rem] rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <select
          name="categoria"
          defaultValue={categoria}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm bg-white"
        >
          <option value="">Todas las categorías</option>
          {Object.entries(CATEGORIAS_CONTACTO).map(([valor, label]) => (
            <option key={valor} value={valor}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
        >
          Buscar
        </button>
      </form>

      {contactos.length === 0 ? (
        <p className="text-sm text-slate-500 rounded-md border border-dashed border-slate-300 p-8 text-center">
          No se encontraron contactos.
        </p>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
          {contactos.map((contacto) => (
            <li key={contacto.id}>
              <Link
                href={`/directorio/${contacto.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{contacto.nombre}</p>
                  <p className="text-xs text-slate-500 truncate">
                    {contacto.telefono ?? "Sin teléfono"}
                    {contacto.email ? ` · ${contacto.email}` : ""}
                  </p>
                </div>
                <span className="text-xs rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-slate-600 shrink-0">
                  {labelCategoria(contacto.categoria)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
