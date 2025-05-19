// lib/quotes.ts
import { showToast } from "@/utils/toastHelper";

export const fetchDailyQuote = async () => {
  try {
    const res = await fetch("/api/quote");
    if (!res.ok) throw new Error("Failed to fetch quote");

    const data = await res.json();
    if (data.quote && data.name) {
      return data;
    }

    showToast("error", "Error!", ["Quote data is missing"]);
    return null;
  } catch (error) {
    console.error("Error fetching quote:", error);
    showToast("error", "Error!", [`Unable to fetch quote: ${error}`]);
    return null;
  }
};
