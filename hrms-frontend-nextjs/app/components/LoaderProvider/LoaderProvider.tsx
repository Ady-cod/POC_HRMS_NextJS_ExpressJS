"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AnimatedLoader from "@/components/AnimatedLoader/AnimatedLoader";

export default function LoaderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  // add a flag for when not-found.tsx is rendered
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    // detect if current rendered page is the not-found page
    const notFoundEl = document.getElementById("not-found-page");
    setIsNotFound(!!notFoundEl);
  }, [pathname]);

  useEffect(() => {
    if (isNotFound) return;

    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [pathname, isNotFound]);

  return (
    <>
      {loading && !isNotFound && <AnimatedLoader />}
      {children}
    </>
  );
}
