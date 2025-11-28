"use client";

import React, { useState } from "react";
import { generatePdf } from "../utils/generatePdf";

export default function PrintButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await generatePdf("privacy-content", "Privacy_Policy-DigitalNexusAI.pdf");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      aria-label="Download printable privacy policy as PDF"
      className={`inline-flex items-center justify-center bg-lightblue-600 px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lightblue-300 ${
        loading ? "opacity-70 cursor-not-allowed" : "hover:bg-lightblue-700"
      }`}
      style={{ backgroundColor: undefined }}
    >
      {loading ? "Preparing PDF..." : "Download PDF"}
    </button>
  );
}
