"use client";

import { useActionState } from "react";
import type { Contacto } from "@prisma/client";
import type { FormState } from "@/lib/actions/agenda";
import ContactoSelect from "@/components/ContactoSelect";

export default function CitaForm({
  accion,
  contactos,
  valoresIniciales,
  textoBoton,
}: {
  accion: (prevState: FormState, formData: FormData) => Promise<FormState>;
  contactos: Contacto[];
  valoresIniciales?: {
    titulo?: string;
    fecha?: string;
    horaInicio?: string;
    horaFin?: string;
    contactoId?: string;
    notas?: string;
  };
  textoBoton: string;
}) {
  const [state, formAction, pending] = useActionState(accion, null);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <p className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
        <input
          name="titulo"
          type="text"
          required
          defaultValue={valoresIniciales?.titulo}
          placeholder="Ej. Limpieza dental, Revisión, Consulta"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
          <input
            name="fecha"
            type="date"
            required
            defaultValue={valoresIniciales?.fecha}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Hora inicio</label>
          <input
            name="horaInicio"
            type="time"
            required
            defaultValue={valoresIniciales?.horaInicio ?? "09:00"}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Hora fin</label>
          <input
            name="horaFin"
            type="time"
            required
            defaultValue={valoresIniciales?.horaFin ?? "09:30"}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Contacto (opcional)</label>
        <ContactoSelect contactos={contactos} valorInicial={valoresIniciales?.contactoId} />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Notas</label>
        <textarea
          name="notas"
          rows={3}
          defaultValue={valoresIniciales?.notas}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-teal-800 px-4 py-2 text-sm font-medium text-white hover:bg-teal-900 disabled:opacity-60"
      >
        {pending ? "Guardando..." : textoBoton}
      </button>
    </form>
  );
}
