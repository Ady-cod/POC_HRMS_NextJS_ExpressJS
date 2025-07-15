// lib/quotesApi.ts

interface QuoteResponse {
  quote: string;
  name: string;
}

// Helper function to calculate seconds until next day (midnight)
const getSecondsUntilMidnight = (): number => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0); // Set to midnight
  
  return Math.floor((tomorrow.getTime() - now.getTime()) / 1000);
};

export const fetchDailyQuoteServer = async (): Promise<QuoteResponse> => {
  const defaultQuote: QuoteResponse = {
    quote: "Wear your failure as a badge of honor!",
    name: "Sundar Pichai",
  };

  try {
    // First, check if API is working (no caching)
    const healthCheck = await fetch("https://zenquotes.io/api/today");
    
    let cacheDuration: number;
    
    if (healthCheck.ok) {
      const healthData = await healthCheck.json();
      if (Array.isArray(healthData) && healthData.length > 0 && healthData[0].q && healthData[0].a) {
        // API is working! Cache until midnight
        cacheDuration = getSecondsUntilMidnight();
      } else {
        // API responds but data is invalid - retry every hour
        cacheDuration = 3600;
      }
    } else {
      // API is down - retry every hour
      cacheDuration = 3600;
    }

    // Now make the actual cached request
    const res = await fetch("https://zenquotes.io/api/today", {
      next: { revalidate: cacheDuration },
    });

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