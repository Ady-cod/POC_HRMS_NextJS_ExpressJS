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
import { getAllEmployees } from "@/actions/employee";
import { EmployeeListItem } from "@/types/types";
import { showToast } from "@/utils/toastHelper";

export default function EnrollmentChart() {
  const [employees, setEmployees] = useState<EmployeeListItem[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getAllEmployees();
        setEmployees(data);

        const deptNames = Array.from(
          new Set(data.map((emp) => emp.department?.name || "Unknown"))
        );
        setDepartments(deptNames);

        // Extract unique years from dateOfJoining
        const yearSet = new Set<number>();
        data.forEach((emp) => {
          if (emp.dateOfJoining) {
            yearSet.add(getYear(parseISO(emp.dateOfJoining)));
          }
        });

        const sortedYears = Array.from(yearSet).sort((a, b) => b - a);
        setYears(sortedYears);
        setSelectedYear("all");
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast("error", "Error!", [
          `Unable to fetch employee data: ${error}`,
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getChartData = () => {
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

      return Object.entries(monthMap)
        .map(([month, employees]) => ({
          month,
          employees,
          sortDate: parse(month, "MMM yyyy", new Date()),
        }))
        .sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime())
        .map(({ month, employees }) => ({ month, employees }));
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
              <div className="w-full h-full flex items-center justify-center text-gray-600">
                No data available for the selected filters.
              </div>
            ):(
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}
