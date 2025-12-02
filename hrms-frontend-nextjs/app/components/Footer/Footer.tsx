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
      <div
        className="
          max-w-7xl mx-auto py-10 px-4
          grid grid-cols-1 md:grid-cols-3
          gap-8
          items-center
          text-darkblue-700
        "
      >
        {/* LEFT — Copy Info */}
        <div className="text-center md:text-left">
          <div className="text-lg font-semibold text-darkblue-600">
            Digital Nexus AI © {year}
          </div>
          <div className="text-sm text-darkblue-300">Founded 2024</div>
        </div>

        {/* CENTER — Links */}
        <div className="flex justify-center">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <Link
              href={`/privacy?from=${encodeURIComponent(currentPath)}`}
              className="text-sm font-medium hover:text-darkblue-900 transition"
            >
              Privacy Policy
            </Link>

            {/* Desktop Separator */}
            <span className="hidden md:inline text-darkblue-300">|</span>

            <button
              onClick={() => setShowTerms(true)}
              aria-haspopup="dialog"
              className="text-sm font-medium hover:text-darkblue-900 transition"
            >
              Terms &amp; Conditions
            </button>
          </div>
        </div>

        {/* RIGHT — Social Icons */}
        <div className="flex justify-center md:justify-end items-center space-x-5">
          <a
            href="https://www.facebook.com/share/1BUHBCLGEp/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Digital Nexus AI on Facebook"
            className="text-darkblue-600 hover:text-blue-600 transition"
          >
            <Facebook size={22} />
          </a>

          <a
            href="https://www.linkedin.com/company/digital-nexus-ai-com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Digital Nexus AI on LinkedIn"
            className="text-darkblue-600 hover:text-blue-700 transition"
          >
            <Linkedin size={22} />
          </a>

          <a
            href="https://www.youtube.com/@digitalnexusai"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Digital Nexus AI on YouTube"
            className="text-darkblue-600 hover:text-red-600 transition"
          >
            <Youtube size={22} />
          </a>
        </div>
      </div>

      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    </footer>
  );
};

export default Footer;
