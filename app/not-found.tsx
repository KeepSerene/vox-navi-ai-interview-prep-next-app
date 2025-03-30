"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NotFound() {
  const router = useRouter();

  return (
    <section className="min-h-screen text-center px-4 flex flex-col items-center justify-center">
      <div className="mb-3 flex items-center gap-2">
        <Image src="/logo.svg" alt="VoxNavi logo" width={38} height={32} />

        <h2 className="text-primary-100">VoxNavi</h2>
      </div>

      <h1 className="text-4xl md:text-6xl font-bold mt-6">404</h1>

      <p className="text-2xl md:text-3xl font-semibold capitalize mt-2">
        Page not found
      </p>

      <p className="max-w-md my-4">
        Oops! The page you're looking for doesn't exist. It might have been
        moved or deleted.
      </p>

      <button
        type="button"
        onClick={() => router.back()}
        className="btn-primary"
      >
        Go back
      </button>
    </section>
  );
}
