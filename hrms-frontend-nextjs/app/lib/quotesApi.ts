
interface QuoteResponse {
  quote: string;
  name: string;
}

export const fetchDailyQuoteServer = async (): Promise<QuoteResponse> => {
  const defaultQuote: QuoteResponse = {
    quote: "Wear your failure as a badge of honor!",
    name: "Sundar Pichai",
  };

  try {
    const res = await fetch("https://zenquotes.io/api/today");

    if (res.ok) {
      const data = await res.json();
      
      if (Array.isArray(data) && data.length > 0 && data[0].q && data[0].a) {
        return {
          quote: data[0].q,
          name: data[0].a,
        };
      } else {
        console.error("Invalid quote data structure received");
      }
    } else {
      console.error("Failed to fetch quote from zenquotes.io:", res.status);
    }
    
  } catch (error) {
    console.error("Error fetching daily quote:", error);
  }

  // Return default quote if anything fails
  return defaultQuote;
}; 