import { requireAdmin } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import UsuarioForm from "@/components/UsuarioForm";
import UsuarioFila from "@/components/UsuarioFila";

export default async function UsuariosPage() {
  const session = await requireAdmin();

  const usuarios = await prisma.usuario.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-8 space-y-6">
      <h1 className="text-xl font-semibold text-teal-900">Usuarios</h1>

      <UsuarioForm />

      <ul className="space-y-2">
        {usuarios.map((usuario) => (
          <UsuarioFila
            key={usuario.id}
            usuario={usuario}
            esUnoMismo={usuario.id === session.user.id}
          />
        ))}
      </ul>
    </div>
  );
}
