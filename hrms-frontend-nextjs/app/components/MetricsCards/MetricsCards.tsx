"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from "recharts";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { EmployeeListItem } from "@/types/types";
import { showToast } from "@/utils/toastHelper";

interface MetricsCardsProps {
  employees: EmployeeListItem[];
  hasError?: boolean;
}

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

const MetricsCards = ({ employees, hasError }: MetricsCardsProps) => {
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);
  const [displayError, setDisplayError] = useState<string>("");

  useEffect(() => {
    async function processEmployeeStats() {
      try {
        if (hasError) {
          // Don't show toast - parent handles error display
          setDisplayError("Unable to load employee data");

          // Set loading to false to show placeholder state
          setLoading(false);
          return;
        }

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
        console.error("Error processing employee stats", err);
        setDisplayError("Error processing employee data");
        // Show toast for component-specific processing errors (not employee fetch errors)
        showToast("error", "Metrics Processing Error", [
          `Unable to process employee metrics: ${err}`,
        ]);
      } finally {
        setLoading(false);
      }
    }

    processEmployeeStats();
  }, [employees, hasError]);

  return (
    <Card className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-6 items-center shadow-none bg-darkblue-50 flex-1">
      {displayError ? (
        // Error placeholder state
        <div className="col-span-3 flex items-center justify-center py-8 text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              Employee metrics temporarily unavailable: <br/>
              <span className="font-semibold">{displayError}</span>
            </p>
          </div>
        </div>
      ) : (
        stats.map((stat, index) => (
          <Card key={index} className="p-2 h-36 shadow-none">
            <CardContent className="-p-2">
              <div className="flex items-center gap-4 mb-1">
                <div className="text-xs text-darkblue-500">
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
              <div className="text-sm text-darkblue-500">{stat.label}</div>
              <div className="text-xl font-bold text-darkblue-700">
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
        ))
      )}
    </Card>
  );
};

export default MetricsCards;
