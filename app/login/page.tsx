import Image from "next/image";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-3">
          <Image
            src="/logo-cpid.png"
            alt="CPID - Centro de Periodoncia e Implantes Dentales"
            width={250}
            height={105}
            className="h-20 w-auto mx-auto"
            priority
          />
          <p className="text-sm text-slate-500">Inicia sesión para continuar</p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
