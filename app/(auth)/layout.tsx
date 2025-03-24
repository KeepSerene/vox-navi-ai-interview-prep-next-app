import type { ReactNode } from "react";
import { isUserAuthenticated } from "@/lib/actions/auth.actions";
import { redirect } from "next/navigation";

async function AuthLayout({ children }: { children: ReactNode }) {
  const isAuthenticated = await isUserAuthenticated();

  if (isAuthenticated) redirect("/");

  return <main className="auth-layout">{children}</main>;
}

export default AuthLayout;
