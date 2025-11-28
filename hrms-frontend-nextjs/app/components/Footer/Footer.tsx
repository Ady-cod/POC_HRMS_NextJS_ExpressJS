"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Facebook, Linkedin, Youtube } from "lucide-react";
import TermsModal from "./TermsModal";

const Footer = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPath =
    pathname + (searchParams ? `?${searchParams.toString()}` : "");
  const [showTerms, setShowTerms] = useState(false);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-darkblue-50">
      <div className="max-w-7xl mx-auto py-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-center sm:items-start text-darkblue-600">
          <div className="text-lg font-semibold">
            Digital Nexus AI &copy; {year}
          </div>
          <div className="text-sm text-darkblue-300">Founded 2023</div>
        </div>

        <div className="flex flex-col items-center sm:items-center sm:flex-row gap-3">
          <Link
            href={`/privacy?from=${encodeURIComponent(currentPath)}`}
            // target="_blank"
            // rel="noopener noreferrer"
            className="text-sm font-medium text-darkblue-700 hover:text-darkblue-900"
          >
            Privacy Policy
          </Link>
          <div className="font-medium text-sm text-darkblue-300">|</div>
          <button
            onClick={() => setShowTerms(true)}
            className="text-sm font-medium text-darkblue-700 hover:text-darkblue-900"
            aria-haspopup="dialog"
          >
            Terms &amp; Conditions
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <a
            href="https://www.facebook.com/share/1BUHBCLGEp/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Digital Nexus AI on Facebook"
            className="text-darkblue-600 hover:text-blue-600"
          >
            <Facebook size={20} />
          </a>

          <a
            href="https://www.linkedin.com/company/digital-nexus-ai-com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Digital Nexus AI on LinkedIn"
            className="text-darkblue-600 hover:text-blue-700"
          >
            <Linkedin size={20} />
          </a>

          <a
            href="https://www.youtube.com/@digitalnexusai"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Digital Nexus AI on YouTube"
            className="text-darkblue-600 hover:text-red-600"
          >
            <Youtube size={20} />
          </a>
        </div>
      </div>

      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    </footer>
  );
};

export default Footer;
