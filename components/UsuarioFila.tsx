"use client";

import { useState, useTransition } from "react";
import { cambiarRolUsuario, cambiarPasswordUsuario, eliminarUsuario } from "@/lib/actions/usuarios";
import { ROLES_LABEL } from "@/lib/constants";
import ConfirmarBoton from "@/components/ConfirmarBoton";

export default function UsuarioFila({
  usuario,
  esUnoMismo,
}: {
  usuario: { id: string; name: string | null; email: string; username: string | null; role: string };
  esUnoMismo: boolean;
}) {
  const [cambiandoPassword, setCambiandoPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <li className="rounded-md border border-slate-200 bg-white p-4 space-y-2">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-sm font-medium text-slate-900">{usuario.name ?? usuario.email}</p>
          <p className="text-xs text-slate-500">
            {usuario.email}
            {usuario.username ? ` · usuario: ${usuario.username}` : ""}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {esUnoMismo ? (
            <span className="text-xs rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-slate-600">
              {ROLES_LABEL[usuario.role]} (tú)
            </span>
          ) : (
            <form
              action={(formData) => {
                startTransition(() => cambiarRolUsuario(usuario.id, formData));
              }}
            >
              <select
                name="role"
                defaultValue={usuario.role}
                disabled={isPending}
                onChange={(e) => e.target.form?.requestSubmit()}
                className="text-xs rounded-md border border-slate-300 px-2 py-1 bg-white"
              >
                {Object.entries(ROLES_LABEL).map(([valor, label]) => (
                  <option key={valor} value={valor}>
                    {label}
                  </option>
                ))}
              </select>
            </form>
          )}

          <button
            type="button"
            onClick={() => setCambiandoPassword((v) => !v)}
            className="text-xs text-slate-600 hover:text-slate-900 underline"
          >
            Cambiar contraseña
          </button>

          {!esUnoMismo && (
            <form
              action={() => {
                startTransition(() => eliminarUsuario(usuario.id));
              }}
            >
              <ConfirmarBoton
                mensaje={`¿Eliminar al usuario ${usuario.name ?? usuario.email}? Sus citas quedarán sin autor asignado.`}
                className="text-xs text-red-600 hover:text-red-800 underline"
              >
                Eliminar
              </ConfirmarBoton>
            </form>
          )}
        </div>
      </div>

      {cambiandoPassword && (
        <form
          action={(formData) => {
            setError("");
            startTransition(async () => {
              const res = await cambiarPasswordUsuario(usuario.id, formData);
              if (res?.error) setError(res.error);
              else setCambiandoPassword(false);
            });
          }}
          className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100"
        >
          {error && <p className="text-xs text-red-600 w-full">{error}</p>}
          <input
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="Nueva contraseña"
            className="rounded-md border border-slate-300 px-2 py-1 text-xs"
          />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-teal-800 text-white px-3 py-1 text-xs font-medium hover:bg-teal-900 disabled:opacity-60"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => setCambiandoPassword(false)}
            className="text-xs text-slate-500 hover:text-slate-700"
          >
            Cancelar
          </button>
        </form>
      )}
    </li>
  );
}
