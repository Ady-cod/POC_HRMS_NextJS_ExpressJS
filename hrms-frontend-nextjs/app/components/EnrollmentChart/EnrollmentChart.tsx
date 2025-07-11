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
import { format, parseISO, parse } from "date-fns";
import { EmployeeListItem } from "@/types/types";

interface EnrollmentChartProps {
  employees: EmployeeListItem[];
  hasError?: boolean;
}

export default function EnrollmentChart({ employees, hasError }: EnrollmentChartProps) {
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function processData() {
      try {
        if (hasError) {
          // Don't show toast - parent handles error display
          setLoading(false);
          return;
        }

        const deptNames = Array.from(
          new Set(employees.map((emp) => emp.department?.name || "Unknown"))
        );
        setDepartments(deptNames);
        setLoading(false);
      } catch (processError) {
        console.error("Error processing data:", processError);
        // Don't show toast - parent handles error display
        setLoading(false);
      }
    }

    processData();
  }, [employees, hasError]);

  const getChartData = () => {
    if (selectedDept === "all") {
      const deptMap: Record<string, number> = {};
      employees.forEach((emp) => {
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
        .filter((emp) => emp.department?.name === selectedDept)
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
  };

  const chartData = getChartData();

  return (
    <div className="rounded-2xl shadow-sm p-4 bg-black/10 border border-black-50 min-h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Employee Enrollment Trends</h2>
        <span className="text-sm text-gray-500">Joined Stats</span>
      </div>

      {hasError ? (
        <div className="w-full flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📈</div>
            <p className="text-sm">Enrollment trends temporarily unavailable</p>
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
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey={selectedDept === "all" ? "department" : "month"}
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
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
