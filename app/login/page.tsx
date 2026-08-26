import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold text-teal-900">Agenda &amp; Directorio</h1>
          <p className="text-sm text-slate-500">Inicia sesión para continuar</p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-slate-500">
          ¿Aún no tienes cuenta?{" "}
          <Link href="/registro" className="text-teal-800 underline">
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}
