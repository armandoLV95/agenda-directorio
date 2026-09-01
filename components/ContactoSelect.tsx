"use client";

import { useEffect, useRef, useState } from "react";
import type { Contacto } from "@prisma/client";

export default function ContactoSelect({
  contactos,
  valorInicial,
}: {
  contactos: Contacto[];
  valorInicial?: string;
}) {
  const contactoInicial = contactos.find((c) => c.id === valorInicial) ?? null;
  const [query, setQuery] = useState(contactoInicial?.nombre ?? "");
  const [selectedId, setSelectedId] = useState(valorInicial ?? "");
  const [abierto, setAbierto] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function alHacerClicFuera(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    }
    document.addEventListener("mousedown", alHacerClicFuera);
    return () => document.removeEventListener("mousedown", alHacerClicFuera);
  }, []);

  const filtrados = query.trim()
    ? contactos.filter((c) => c.nombre.toLowerCase().includes(query.trim().toLowerCase()))
    : contactos;

  function seleccionar(contacto: Contacto | null) {
    setSelectedId(contacto?.id ?? "");
    setQuery(contacto?.nombre ?? "");
    setAbierto(false);
  }

  return (
    <div className="relative" ref={containerRef}>
      <input type="hidden" name="contactoId" value={selectedId} />
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelectedId("");
          setAbierto(true);
        }}
        onFocus={() => setAbierto(true)}
        placeholder="Buscar contacto..."
        autoComplete="off"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
      {abierto && (
        <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border border-slate-200 bg-white shadow-lg text-sm">
          <li
            onClick={() => seleccionar(null)}
            className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-slate-500"
          >
            — Sin asignar —
          </li>
          {filtrados.map((c) => (
            <li
              key={c.id}
              onClick={() => seleccionar(c)}
              className="px-3 py-2 hover:bg-teal-50 cursor-pointer truncate"
            >
              {c.nombre}
            </li>
          ))}
          {filtrados.length === 0 && (
            <li className="px-3 py-2 text-slate-400">Sin resultados</li>
          )}
        </ul>
      )}
    </div>
  );
}
