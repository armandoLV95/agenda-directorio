import { signOut } from "@/lib/auth";

export default function CerrarSesionBoton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/login" });
      }}
    >
      <button type="submit" className="text-teal-200 hover:text-white underline">
        Salir
      </button>
    </form>
  );
}
