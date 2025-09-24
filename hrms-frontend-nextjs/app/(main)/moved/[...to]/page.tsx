"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function MovedPage() {
  const router = useRouter();
  const { to } = useParams<{ to?: string[] }>();
  const target = "/" + (to?.join("/") ?? "");

  useEffect(() => {
    const t = setTimeout(() => router.replace(target), 8000);
    return () => clearTimeout(t);
  }, [router, target]);

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-xl font-semibold mb-2">This page moved</h1>
      <p className="mb-4">
        We’ve renamed this section. Taking you to the new location…
      </p>
      <a className="underline" href={target}>
        Go now
      </a>
    </main>
  );
}
