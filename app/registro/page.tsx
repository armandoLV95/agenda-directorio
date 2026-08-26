import Link from "next/link";
import RegistroForm from "@/components/RegistroForm";

export default function RegistroPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold text-teal-900">Crear cuenta</h1>
          <p className="text-sm text-slate-500">Da de alta el primer acceso al sistema</p>
        </div>

        <RegistroForm />

        <p className="text-center text-sm text-slate-500">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-teal-800 underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
