"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO, getYear } from "date-fns";
import { EmployeeListItem } from "@/types/types";
import { showToast } from "@/utils/toastHelper";

interface ProcessedEmployee extends EmployeeListItem {
  joinYear: number | null;
  joinDate: Date | null;
  joinMonthYear: string | null;
}

interface EnrollmentChartProps {
  employees: EmployeeListItem[];
  hasError?: boolean;
}

// Add discriminated union for year filter
type YearFilter = { kind: "all" } | { kind: "year"; value: number };

export default function EnrollmentChart({ employees, hasError }: EnrollmentChartProps) {
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<YearFilter>({ kind: "all" });
  const [loading, setLoading] = useState<boolean>(true);
  const [displayError, setDisplayError] = useState<string>("");

  // Minimum pixels per bar to prevent label overlap
  const MIN_BAR_PX = 80;

  // Pre-process employee data to avoid redundant date parsing
  const processedEmployees = useMemo<ProcessedEmployee[]>(() => {
    if (hasError || !employees.length) return [];
    
    return employees.map((emp) => {
      let joinYear: number | null = null;
      let joinDate: Date | null = null;
      let joinMonthYear: string | null = null;

      if (emp.dateOfJoining) {
        try {
          joinDate = parseISO(emp.dateOfJoining);
          joinYear = getYear(joinDate);
          joinMonthYear = format(joinDate, "MMM yyyy");
        } catch (error) {
          console.warn(`Invalid date format for employee ${emp.id}: ${emp.dateOfJoining}`, error);
        }
      }

      return {
        ...emp,
        joinYear,
        joinDate,
        joinMonthYear,
      };
    });
  }, [employees, hasError]);

  // Extract unique departments and years from processed data
  const { uniqueDepartments, uniqueYears } = useMemo(() => {
    const deptSet = new Set<string>();
    const yearSet = new Set<number>();

    processedEmployees.forEach((emp) => {
      deptSet.add(emp.department?.name || "Unknown");
      if (emp.joinYear !== null) {
        yearSet.add(emp.joinYear);
      }
    });

    return {
      uniqueDepartments: Array.from(deptSet),
      uniqueYears: Array.from(yearSet).sort((a, b) => b - a), // Newest first
    };
  }, [processedEmployees]);

  useEffect(() => {
    setLoading(true);
    setDisplayError(""); // Clear error before processing
    function processData() {
      try {
        if (hasError) {
          setDisplayError("Unable to load employee data");
          return;
        }
        if (processedEmployees.length === 0) {
          setDisplayError("No employee data available");
          return;
        }
        setSelectedYear({ kind: "all" });
      } catch (processError) {
        console.error("Error processing data:", processError);
        setDisplayError("Error processing employee data");
        showToast("error", "Enrollment Chart Error", [
          `Unable to process enrollment data: ${processError}`,
        ]);
      } finally {
        setLoading(false);
      }
    }
    processData();
  }, [processedEmployees, hasError]);

  // Memoize chart data calculation to avoid recalculation on every render
  const chartData = useMemo(() => {
    try {
      if (processedEmployees.length === 0) {
        return [];
      }

      if (selectedDept === "all") {
        // Department-wise view
        const deptMap: Record<string, number> = {};
        processedEmployees
          .filter((emp) =>
            selectedYear.kind === "all" || emp.joinYear === selectedYear.value
          )
          .forEach((emp) => {
            const dept = emp.department?.name || "Unknown";
            deptMap[dept] = (deptMap[dept] || 0) + 1;
          });

        return Object.entries(deptMap).map(([department, employees]) => ({
          department,
          employees,
        }));
      } else {
        // Monthly view for selected department
        const monthMap: Record<string, { count: number; sortDate: Date }> = {};
        processedEmployees
          .filter((emp) =>
            emp.department?.name === selectedDept &&
            emp.joinMonthYear !== null &&
            emp.joinDate !== null &&
            (selectedYear.kind === "all" || emp.joinYear === selectedYear.value)
          )
          .forEach((emp) => {
            const monthKey = emp.joinMonthYear!;
            if (!monthMap[monthKey]) {
              monthMap[monthKey] = {
                count: 0,
                sortDate: emp.joinDate!,
              };
            }
            monthMap[monthKey].count += 1;
          });

        // Sort entries chronologically and return formatted data
        return Object.entries(monthMap)
          .sort(([, a], [, b]) => a.sortDate.getTime() - b.sortDate.getTime())
          .map(([month, { count }]) => ({
            month,
            employees: count,
          }));
      }
    } catch (error) {
      console.error("Error generating chart data:", error);
      setDisplayError("Error generating chart data");
      showToast("error", "Enrollment Chart Data Error", [
        `Unable to generate chart data: ${error}`,
      ]);
      return []; // Return empty array as fallback
    }
  }, [selectedDept, selectedYear, processedEmployees]);

  return (
    <div className="rounded-2xl shadow-sm px-8 pt-8 justify-center bg-black/10 border border-black-50 min-h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Employee Enrollment Trends</h2>

        <Select
          onValueChange={(val) =>
            setSelectedYear(val === "all" ? { kind: "all" } : { kind: "year", value: Number(val) })
          }
          defaultValue="all"
          disabled={loading || !!displayError}
        >
          <SelectTrigger className="w-32 border-0 shadow-none">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {uniqueYears.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {displayError ? (
        <div className="w-full flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-3">📈</div>
            <p className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              Enrollment trends temporarily unavailable: <br />
              <span className="font-semibold">{displayError}</span>
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <Select
              onValueChange={(val) => setSelectedDept(val)}
              defaultValue="all"
              disabled={loading}
            >
              <SelectTrigger className="w-60 border-black">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Show All</SelectItem>
                {uniqueDepartments
                  .filter((dept) => dept !== "Unknown")
                  .map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="w-full flex-1 flex items-center justify-center text-gray-600">
              Loading...
            </div>
          ) : (
            <div className="w-full overflow-x-auto flex-1">
              <div
                className="min-w-full h-full"
                style={{
                  width:
                    selectedDept !== "all"
                      ? Math.max(600, chartData.length * 60) + "px"
                      : Math.max(chartData.length * MIN_BAR_PX, 600) + "px",
                }}
              >
                {chartData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-80 bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-red-800 mb-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    <h2 className="text-lg font-semibold text-red-800 mb-1">
                      No data available for the selected filter
                    </h2>
                    <p className="text-sm text-red-800">
                      {displayError ||
                        "Try changing the year or department to see results."}
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey={
                          selectedDept === "all" ? "department" : "month"
                        }
                        interval={0}
                        angle={selectedDept === "all" ? -35 : -45}
                        textAnchor="end"
                        height={90}
                      />
                      <YAxis allowDecimals={false} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div
                                style={{
                                  backgroundColor: "#fff",
                                  border: "1px solid #d1d5db",
                                  borderRadius: "6px",
                                  padding: "8px 12px",
                                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                <p style={{ margin: 0, color: "#374151", fontWeight: "500" }}>
                                  {label}
                                </p>
                                <p style={{ margin: 0, color: "#6b767f" }}>
                                  Employees: {payload[0].value}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="employees"
                        fill="#6b767f"
                        radius={[6, 6, 0, 0]}
                        barSize={selectedDept !== "all" ? 35 : 40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
