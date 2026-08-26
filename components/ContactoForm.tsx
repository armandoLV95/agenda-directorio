"use client";

import { useActionState } from "react";
import { CATEGORIAS_CONTACTO } from "@/lib/constants";
import type { FormState } from "@/lib/actions/directorio";

export default function ContactoForm({
  accion,
  valoresIniciales,
  textoBoton,
}: {
  accion: (prevState: FormState, formData: FormData) => Promise<FormState>;
  valoresIniciales?: {
    nombre?: string;
    categoria?: string;
    telefono?: string;
    telefono2?: string;
    email?: string;
    direccion?: string;
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
        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
        <input
          name="nombre"
          type="text"
          required
          defaultValue={valoresIniciales?.nombre}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
        <select
          name="categoria"
          defaultValue={valoresIniciales?.categoria ?? "PACIENTE"}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm bg-white"
        >
          {Object.entries(CATEGORIAS_CONTACTO).map(([valor, label]) => (
            <option key={valor} value={valor}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
          <input
            name="telefono"
            type="tel"
            defaultValue={valoresIniciales?.telefono}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono 2</label>
          <input
            name="telefono2"
            type="tel"
            defaultValue={valoresIniciales?.telefono2}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Correo</label>
        <input
          name="email"
          type="email"
          defaultValue={valoresIniciales?.email}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
        <input
          name="direccion"
          type="text"
          defaultValue={valoresIniciales?.direccion}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Notas</label>
        <textarea
          name="notas"
          rows={3}
          placeholder="Alergias, preferencias, observaciones..."
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
