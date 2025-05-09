"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from "recharts";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { IBM_Plex_Sans } from "next/font/google";
import { getAllEmployees } from "@/actions/employee";
import { showToast } from "@/utils/toastHelper";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ibm-plex-sans",
});

const defaultStats = [
  {
    label: "Employees",
    value: null,
    change: null,
    direction: "up",
    chartColor: "#22c55e",
    chartData: [],
  },
  {
    label: "Attendees",
    value: 52,
    change: "-3 from last week",
    direction: "down",
    chartColor: "#ef4444",
    chartData: [
      { name: "Mon", value: 58 },
      { name: "Tue", value: 55 },
      { name: "Wed", value: 54 },
      { name: "Thu", value: 53 },
      { name: "Fri", value: 52 },
      { name: "Sat", value: 51 },
      { name: "Sun", value: 52 },
    ],
  },
  {
    label: "Time to hire",
    value: "10 days",
    change: "+2 from last week",
    direction: "up",
    chartColor: "#3b82f6",
    chartData: [
      { name: "Mon", value: 20000 },
      { name: "Tue", value: 21000 },
      { name: "Wed", value: 21500 },
      { name: "Thu", value: 21800 },
      { name: "Fri", value: 22000 },
      { name: "Sat", value: 23000 },
      { name: "Sun", value: 24000 },
    ],
  },
];

type QuoteType = {
  quote: string;
  name: string;
};

const fetchQuotes = async () => {
  try {
    const response = await fetch("/quotes.json");
    const data = await response.json();
    return data;
  } catch (error) {
    showToast("error","Error!",[`Unable to fetch quotes: ${error}`]);
    console.error("Error fetching quotes:", error);
    return [];
  }
};

const getDailyQuote = (quotes: QuoteType[]) => {
  const today = new Date();
  const dayOfYear = today.getDate() + today.getMonth() * 30;
  const randomIndex = dayOfYear % quotes.length;
  return quotes[randomIndex];
};
export default function DashboardStats() {
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState<{ quote: string; name: string }>({
    quote: "Wear your failure as a badge of honor!",
    name: "Sundar Pichai",
  });

  useEffect(() => {
    // Fetch employee stats
    async function fetchEmployeeStats() {
      try {
        const employees = await getAllEmployees();

        const chartData = employees
          .filter((emp) => emp.dateOfJoining)
          .sort(
            (a, b) =>
              new Date(a.dateOfJoining).getTime() -
              new Date(b.dateOfJoining).getTime()
          )
          .slice(-7)
          .map((emp, idx: number) => ({
            name: `Day ${idx + 1}`,
            value: idx === 6 ? employees.length : 300 + idx * 10,
          }));

        setStats((prev) =>
          prev.map((s) =>
            s.label === "Employees"
              ? {
                  ...s,
                  value: employees.length,
                  change: "+10 from last week",
                  chartData,
                }
              : s
          )
        );
      } catch (err) {
        showToast("error","Error!",[`Unable to fetch employee stats: ${err}`]);
        console.error("Error fetching employee stats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEmployeeStats();
  }, []);

  // Fetch random quote

  useEffect(() => {
    async function loadQuote() {
      const quotes = await fetchQuotes();
      if (quotes.length > 0) {
        const dailyQuote = getDailyQuote(quotes);
        setQuote(dailyQuote);
      }
    }

    loadQuote();
  }, []);

  return (
    <div className="space-y-6">
      {quote && (
        <Card className={`p-6 text-center bg-black/10 ${ibmPlexSans.variable} text-xl md:text-2xl lg:text-3xl xl:text-4xl`}>
          <h2 className="font-bold ">Today&apos;s Quote</h2>
          <p className="text-gray-700 mt-4">“{quote.quote}”</p>
          <p className="text-gray-500 mt-2 text-lg md:text-xl lg:text-2xl xl:text-3xl text-end">– {quote.name}</p>
        </Card>
      )}

      <Card className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-6 shadow-none bg-black/10">
        {stats.map((stat, index) => (
          <Card key={index} className="p-2 h-36 shadow-none">
            <CardContent className="-p-2">
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs text-gray-500">
                  {loading && stat.label === "Employees"
                    ? "Loading..."
                    : stat.change}
                </div>
                <div
                  className={`text-xs ${
                    stat.direction === "up" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stat.direction === "up" ? <FaArrowUp /> : <FaArrowDown />}
                </div>
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
              <div className="text-xl font-bold">
                {loading && stat.label === "Employees"
                  ? "Loading..."
                  : stat.value}
              </div>
              <div className="h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stat.chartData}>
                    <defs>
                      <linearGradient
                        id={`colorUv-${index}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={stat.chartColor}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={stat.chartColor}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={stat.chartColor}
                      fillOpacity={1}
                      fill={`url(#colorUv-${index})`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </Card>
    </div>
  );
}
