"use client"; 

import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  className: string;
  children: React.ReactNode;
}

export default function SubmitButton({ className, children }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? "Loading..." : children}
    </button>
  );
}
