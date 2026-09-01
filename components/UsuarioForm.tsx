"use client";

import { useActionState } from "react";
import { crearUsuario } from "@/lib/actions/usuarios";
import { ROLES, ROLES_LABEL } from "@/lib/constants";

export default function UsuarioForm() {
  const [state, formAction, pending] = useActionState(crearUsuario, null);

  return (
    <form action={formAction} className="space-y-3 rounded-md border border-slate-200 bg-white p-4">
      <h2 className="font-medium text-slate-700">Nuevo usuario</h2>
      {state?.error && (
        <p className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          name="name"
          type="text"
          placeholder="Nombre"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Correo"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          name="username"
          type="text"
          placeholder="Usuario para entrar (opcional)"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="Contraseña (mínimo 8 caracteres)"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <select name="role" defaultValue={ROLES.ASISTENTE} className="rounded-md border border-slate-300 px-3 py-2 text-sm bg-white">
          {Object.entries(ROLES_LABEL).map(([valor, label]) => (
            <option key={valor} value={valor}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-teal-800 px-4 py-2 text-sm font-medium text-white hover:bg-teal-900 disabled:opacity-60"
      >
        {pending ? "Creando..." : "Crear usuario"}
      </button>
    </form>
  );
}
