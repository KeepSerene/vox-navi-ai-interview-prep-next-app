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

      {/* Min height = 100dvh - margin-top - header height */}
      {/* This is set specifically for centering the spinner component  */}
      <main className="min-h-[calc(100dvh-2rem-36px)] sm:min-h-[calc(100dvh-3rem-36px)] relative">
        {children}
      </main>
    </div>
  );
}

export default RootLayout;
