import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ROLES } from "@/lib/constants";

export async function requireSession() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}

export async function requireAdmin() {
  const session = await requireSession();
  if (session.user.role !== ROLES.ADMIN) redirect("/");
  return session;
}
