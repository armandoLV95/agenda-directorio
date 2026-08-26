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
      </div>
    </div>
  );
}
