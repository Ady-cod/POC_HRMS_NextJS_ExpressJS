"use client";

import { useEffect, useState } from "react";
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
import { format, parseISO, parse, getYear } from "date-fns";
import { EmployeeListItem } from "@/types/types";
import { showToast } from "@/utils/toastHelper";

interface EnrollmentChartProps {
  employees: EmployeeListItem[];
  hasError?: boolean;
}

export default function EnrollmentChart({ employees, hasError }: EnrollmentChartProps) {
  const [departments, setDepartments] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [displayError, setDisplayError] = useState<string>("");

  useEffect(() => {
    async function processData() {
      try {
        if (hasError) {
          // Don't show toast - parent handles error display
          setDisplayError("Unable to load employee data");
          setLoading(false);
          return;
        }

        const deptNames = Array.from(
          new Set(employees.map((emp) => emp.department?.name || "Unknown"))
        );
        setDepartments(deptNames);
        setLoading(false);

        // Extract unique years from dateOfJoining
        const yearSet = new Set<number>();
        employees.forEach((emp) => {
          if (emp.dateOfJoining) {
            yearSet.add(getYear(parseISO(emp.dateOfJoining)));
          }
        });

        const sortedYears = Array.from(yearSet).sort((a, b) => b - a);
        setYears(sortedYears);
        setSelectedYear("all");
      } catch (processError) {
        console.error("Error processing data:", processError);
        setDisplayError("Error processing employee data");
        // Show toast for component-specific processing errors (not employee fetch errors)
        showToast("error", "Enrollment Chart Error", [
          `Unable to process enrollment data: ${processError}`,
        ]);
        setLoading(false);
      }
    }

    processData();
  }, [employees, hasError]);

  const getChartData = () => {
    try {
      if (selectedDept === "all") {
        const deptMap: Record<string, number> = {};
        employees
          .filter(
            (emp) =>
              selectedYear === "all" ||
              getYear(parseISO(emp.dateOfJoining)) === selectedYear
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
        const monthMap: Record<string, number> = {};
        employees
          .filter(
            (emp) =>
              emp.department?.name === selectedDept &&
              (selectedYear === "all" ||
                getYear(parseISO(emp.dateOfJoining)) === selectedYear)
          )
          .forEach((emp) => {
            const date = parseISO(emp.dateOfJoining);
            const month = format(date, "MMM yyyy");
            monthMap[month] = (monthMap[month] || 0) + 1;
          });

          // Sort entries chronologically
          return Object.entries(monthMap)
            .map(([month, employees]) => ({
              month,
              employees,
              sortDate: parse(month, "MMM yyyy", new Date()), // Convert "MMM yyyy" to Date for sorting
            }))
            .sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime())
            .map(({ month, employees }) => ({
              month,
              employees,
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
  };
  

  const chartData = getChartData();

  return (
    <div className="rounded-2xl shadow-sm px-8 pt-8 justify-center bg-black/10 border border-black-50 min-h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Employee Enrollment Trends</h2>

        <Select
          onValueChange={(val) =>
            setSelectedYear(val === "all" ? "all" : parseInt(val))
          }
          defaultValue="all"
        >
          <SelectTrigger className="w-32 border-0 shadow-none">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map((year) => (
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
            >
              <SelectTrigger className="w-60 border-black">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Show All</SelectItem>
                {departments.map((dept) => (
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
                      : "100%",
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
                        angle={selectedDept !== "all" ? -45 : 0}
                        textAnchor={selectedDept !== "all" ? "end" : "middle"}
                        height={selectedDept !== "all" ? 100 : 60}
                      />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
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
