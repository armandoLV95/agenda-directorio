"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

export type FormState = { error: string } | null;

export async function loginConCredenciales(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get("email");
  const password = formData.get("password");
  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return { error: "Ingresa tu correo o usuario y tu contraseña." };
  }

  try {
    await signIn("local-login", { email, password, redirectTo: "/" });
  } catch (e) {
    if (e instanceof AuthError) {
      return { error: "Correo/usuario o contraseña incorrectos." };
    }
    // NEXT_REDIRECT (login exitoso) no es un AuthError: hay que dejarlo pasar.
    throw e;
  }
  return null;
}
