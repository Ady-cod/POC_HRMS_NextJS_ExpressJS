import { Card } from "@/components/ui/card";
import { fetchDailyQuoteServer } from "@/lib/quotesApi";


const DailyQuote = async () => {
  // Fetch quote on the server side
  const quote = await fetchDailyQuoteServer();

  return (
    <Card
      className={`p-6 text-center bg-darkblue-50  text-xl md:text-2xl lg:text-3xl xl:text-4xl`}
    >
      <h2 className="font-bold text-darkblue-700">Today&apos;s Quote</h2>
      <p className="text-darkblue-400 mt-6 text-3xl">&ldquo;{quote.quote}&rdquo;</p>
      <p className="text-darkblue-300 mt-6 text-lg md:text-xl lg:text-2xl xl:text-3xl text-end font-bold">
        – {quote.name}
      </p>
    </Card>
  );
};

export default DailyQuote;
