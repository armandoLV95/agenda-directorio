"use client";

import { useRef, useState } from "react";

type Periodo = "AM" | "PM";

function hm24ADisplay(hm: string): { horaMin: string; periodo: Periodo } {
  const m = hm.match(/^(\d{2}):(\d{2})$/);
  if (!m) return { horaMin: "", periodo: "AM" };
  const h = Number(m[1]);
  const min = m[2];
  const periodo: Periodo = h >= 12 ? "PM" : "AM";
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return { horaMin: `${String(h12).padStart(2, "0")}:${min}`, periodo };
}

function displayA24(horaMin: string, periodo: Periodo): string | null {
  const m = horaMin.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2]);
  if (h < 1 || h > 12 || min > 59) return null;
  if (periodo === "AM") h = h === 12 ? 0 : h;
  else h = h === 12 ? 12 : h + 12;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

// Input de hora propio en formato de 12 horas (hh:mm a.m./p.m.), independiente del
// formato de 12/24 horas configurado en la computadora de quien lo use. El
// <input type="time"> nativo se mantiene oculto, solo para abrir el selector visual.
export default function HoraInput({
  name,
  valorInicial,
}: {
  name: string;
  valorInicial?: string;
}) {
  const inicial = hm24ADisplay(valorInicial ?? "");
  const [horaMin, setHoraMin] = useState(inicial.horaMin);
  const [periodo, setPeriodo] = useState<Periodo>(inicial.periodo);
  const [hm24, setHm24] = useState(valorInicial ?? "");
  const nativeRef = useRef<HTMLInputElement>(null);

  function actualizar(nuevoHoraMin: string, nuevoPeriodo: Periodo) {
    setHoraMin(nuevoHoraMin);
    setPeriodo(nuevoPeriodo);
    const nuevo24 = displayA24(nuevoHoraMin, nuevoPeriodo);
    if (nuevo24) setHm24(nuevo24);
  }

  return (
    <div className="relative flex items-stretch rounded-md border border-slate-300 overflow-hidden">
      <input type="hidden" name={name} value={hm24} required />
      <input
        type="text"
        inputMode="numeric"
        placeholder="hh:mm"
        value={horaMin}
        onChange={(e) => {
          const digitos = e.target.value.replace(/\D/g, "").slice(0, 4);
          const formateado = digitos.length > 2 ? `${digitos.slice(0, 2)}:${digitos.slice(2)}` : digitos;
          actualizar(formateado, periodo);
        }}
        className="min-w-0 flex-1 px-3 py-2 text-sm focus:outline-none"
      />
      <button
        type="button"
        onClick={() => actualizar(horaMin, periodo === "AM" ? "PM" : "AM")}
        className="px-2 text-xs font-medium text-slate-500 hover:bg-slate-50 border-l border-slate-300"
      >
        {periodo === "AM" ? "a.m." : "p.m."}
      </button>
      <button
        type="button"
        onClick={() => nativeRef.current?.showPicker?.()}
        className="px-2 text-slate-400 hover:text-slate-600 border-l border-slate-300"
        aria-label="Abrir selector de hora"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .284.16.544.415.67l3.5 1.75a.75.75 0 0 0 .67-1.34L10.75 9.54V5Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <input
        ref={nativeRef}
        type="time"
        tabIndex={-1}
        aria-hidden
        value={hm24}
        onChange={(e) => {
          setHm24(e.target.value);
          const d = hm24ADisplay(e.target.value);
          setHoraMin(d.horaMin);
          setPeriodo(d.periodo);
        }}
        className="absolute inset-0 h-full w-full opacity-0 pointer-events-none"
      />
    </div>
  );
}
