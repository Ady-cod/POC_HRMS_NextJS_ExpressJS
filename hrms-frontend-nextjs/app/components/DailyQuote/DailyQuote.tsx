"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { IBM_Plex_Sans } from "next/font/google";
import { fetchDailyQuote } from "@/lib/quotes";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ibm-plex-sans",
});

const DailyQuote = () => {
  const [quote, setQuote] = useState<{ quote: string; name: string }>({
    quote: "Wear your failure as a badge of honor!",
    name: "Sundar Pichai",
  });

  useEffect(() => {
    async function loadQuote() {
      try {
        const dailyQuote = await fetchDailyQuote();
        if (dailyQuote) {
          setQuote(dailyQuote);
        }
      } catch (err) {
        console.error("Error fetching daily quote", err);
      }
    }

    loadQuote();
  }, []);

  return (
    <Card
      className={`p-6 text-center bg-black/10 ${ibmPlexSans.variable} text-xl md:text-2xl lg:text-3xl xl:text-4xl`}
    >
      <h2 className="font-bold">Today&apos;s Quote</h2>
      <p className="text-gray-700 mt-4">&ldquo;{quote.quote}&rdquo;</p>
      <p className="text-gray-500 mt-2 text-lg md:text-xl lg:text-2xl xl:text-3xl text-end">
        – {quote.name}
      </p>
    </Card>
  );
};

export default DailyQuote;
