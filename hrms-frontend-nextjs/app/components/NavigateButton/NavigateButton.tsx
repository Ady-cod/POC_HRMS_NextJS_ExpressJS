"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface NavigateButtonProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export default function NavigateButton({
  href,
  className,
  children,
}: NavigateButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleClick = () => {
    setPending(true);
    router.push(href);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={className}
    >
      {pending ? "Navigating..." : children}
    </button>
  );
}
