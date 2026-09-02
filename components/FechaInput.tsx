"use client";

import { useRef, useState } from "react";

function ymdADisplay(ymd: string): string {
  const m = ymd.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return "";
  const [, y, mo, d] = m;
  return `${d}/${mo}/${y}`;
}

function displayAYmd(display: string): string | null {
  const m = display.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const [, d, mo, y] = m;
  return `${y}-${mo}-${d}`;
}

// Input de fecha propio, independiente del idioma/región configurados en la
// computadora de quien lo use: siempre se escribe y se lee como dd/mm/aaaa. El
// <input type="date"> nativo se usa solo para abrir el calendario visual, oculto
// de la vista para que su formato de despliegue (que sí varía por equipo) no se note.
export default function FechaInput({ valorInicial }: { valorInicial?: string }) {
  const [display, setDisplay] = useState(ymdADisplay(valorInicial ?? ""));
  const [ymd, setYmd] = useState(valorInicial ?? "");
  const nativeRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <input type="hidden" name="fecha" value={ymd} required />
      <input
        type="text"
        inputMode="numeric"
        placeholder="dd/mm/aaaa"
        value={display}
        onChange={(e) => {
          const digitos = e.target.value.replace(/\D/g, "").slice(0, 8);
          let formateado = digitos;
          if (digitos.length > 4) formateado = `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
          else if (digitos.length > 2) formateado = `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
          setDisplay(formateado);
          const nuevoYmd = displayAYmd(formateado);
          if (nuevoYmd) setYmd(nuevoYmd);
        }}
        className="w-full rounded-md border border-slate-300 pl-3 pr-9 py-2 text-sm"
      />
      <button
        type="button"
        onClick={() => nativeRef.current?.showPicker?.()}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        aria-label="Abrir calendario"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path
            fillRule="evenodd"
            d="M5.75 2.5a.75.75 0 0 1 .75.75V4h7v-.75a.75.75 0 0 1 1.5 0V4h.5A2.25 2.25 0 0 1 17.75 6.25v8.5A2.25 2.25 0 0 1 15.5 17h-11a2.25 2.25 0 0 1-2.25-2.25v-8.5A2.25 2.25 0 0 1 4.5 4H5v-.75a.75.75 0 0 1 .75-.75ZM3.75 8v6.75c0 .414.336.75.75.75h11a.75.75 0 0 0 .75-.75V8h-12.5Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <input
        ref={nativeRef}
        type="date"
        tabIndex={-1}
        aria-hidden
        value={ymd}
        onChange={(e) => {
          setYmd(e.target.value);
          setDisplay(ymdADisplay(e.target.value));
        }}
        className="absolute inset-0 h-full w-full opacity-0 pointer-events-none"
      />
    </div>
  );
}
