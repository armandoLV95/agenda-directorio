"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CATEGORIAS_CONTACTO } from "@/lib/constants";

export default function DirectorioBuscador({
  qInicial,
  categoriaInicial,
}: {
  qInicial: string;
  categoriaInicial: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(qInicial);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function actualizarUrl(nuevoQ: string, nuevaCategoria: string) {
    const params = new URLSearchParams(searchParams);
    if (nuevoQ) params.set("q", nuevoQ);
    else params.delete("q");
    if (nuevaCategoria) params.set("categoria", nuevaCategoria);
    else params.delete("categoria");
    router.replace(`${pathname}?${params.toString()}`);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="flex flex-wrap gap-2">
      <input
        type="text"
        value={q}
        onChange={(e) => {
          const valor = e.target.value;
          setQ(valor);
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => actualizarUrl(valor, categoriaInicial), 250);
        }}
        placeholder="Buscar por nombre, teléfono o correo..."
        className="flex-1 min-w-[12rem] rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
      <select
        defaultValue={categoriaInicial}
        onChange={(e) => actualizarUrl(q, e.target.value)}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm bg-white"
      >
        <option value="">Todas las categorías</option>
        {Object.entries(CATEGORIAS_CONTACTO).map(([valor, label]) => (
          <option key={valor} value={valor}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
