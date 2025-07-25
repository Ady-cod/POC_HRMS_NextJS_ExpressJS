import { Card } from "@/components/ui/card";
import { fetchDailyQuoteServer } from "@/lib/quotesApi";


const DailyQuote = async () => {
  // Fetch quote on the server side
  const quote = await fetchDailyQuoteServer();

  return (
    <Card
      className={`p-6 text-center bg-black/10  text-xl md:text-2xl lg:text-3xl xl:text-4xl`}
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
