import Link from "next/link";
import { auth } from "@/lib/auth";
import CerrarSesionBoton from "@/components/CerrarSesionBoton";

export default async function Nav() {
  const session = await auth();
  if (!session?.user) return null;

  return (
    <header className="bg-teal-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        <Link href="/" className="font-semibold text-lg tracking-tight">
          Agenda &amp; Directorio
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/agenda" className="hover:text-teal-200">
            Agenda
          </Link>
          <Link href="/directorio" className="hover:text-teal-200">
            Directorio
          </Link>
          <span className="text-teal-300">{session.user.name ?? session.user.email}</span>
          <CerrarSesionBoton />
        </nav>
      </div>
    </header>
  );
}
