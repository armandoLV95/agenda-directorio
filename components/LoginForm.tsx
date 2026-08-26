"use client";

import { useActionState } from "react";
import { loginConCredenciales } from "@/lib/actions/auth";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginConCredenciales, null);

  return (
    <form action={formAction} className="space-y-3">
      {state?.error && (
        <p className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <input
        name="email"
        type="text"
        required
        placeholder="Correo o usuario"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
      <input
        name="password"
        type="password"
        required
        placeholder="Contraseña"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-teal-800 px-4 py-2 text-sm font-medium text-white hover:bg-teal-900 disabled:opacity-60"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
