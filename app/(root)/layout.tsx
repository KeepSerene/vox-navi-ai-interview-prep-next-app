import type { ReactNode } from "react";
import { isUserAuthenticated } from "@/lib/actions/auth.actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

async function RootLayout({ children }: { children: ReactNode }) {
  const isAuthenticated = await isUserAuthenticated();

  if (!isAuthenticated) redirect("/sign-in");

  return (
    <div className="root-layout">
      <header>
        <nav>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="VoxNavi logo" width={38} height={32} />

            <h2 className="text-primary-100">VoxNavi</h2>
          </Link>
        </nav>
      </header>

      <main>{children}</main>
    </div>
  );
}

export default RootLayout;
