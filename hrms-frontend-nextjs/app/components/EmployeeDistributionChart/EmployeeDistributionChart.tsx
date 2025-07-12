"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EmployeeListItem } from "@/types/types";
import { showToast } from "@/utils/toastHelper";

type TransformedEmployeeData = {
  name: string;
  value: number;
};

interface EmployeeDistributionChartProps {
  employees: EmployeeListItem[];
  hasError?: boolean;
}

const EmployeeDistributionChart = ({ employees, hasError }: EmployeeDistributionChartProps) => {
  const [employeeData, setEmployeeData] = useState<TransformedEmployeeData[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [displayError, setDisplayError] = useState<string>("");

  useEffect(() => {
    const processEmployeeData = async () => {
      try {
        if (hasError) {
          // Don't show toast - parent handles error display
          setDisplayError("Unable to load employee data");
          setLoading(false);
          return;
        }

        const departmentCounts: { [key: string]: number } = {};
        employees.forEach((emp) => {
          const deptName = emp.department?.name || "Unknown";
          departmentCounts[deptName] = (departmentCounts[deptName] || 0) + 1;
        });
        const transformedData = Object.entries(departmentCounts).map(
          ([name, value]) => ({
            name,
            value,
          })
        );

        setEmployeeData(transformedData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setDisplayError("Error processing employee data");
        // Show toast for component-specific processing errors (not employee fetch errors)
        showToast("error", "Distribution Chart Error", [
          `Unable to process employee distribution data: ${err}`,
        ]);
        setLoading(false);
      }
    };

    processEmployeeData();
  }, [employees, hasError]);

  if (loading) {
    return (
      <Card className="p-6 bg-black/10 shadow-none min-h-full">
        <CardContent className="p-0 flex items-center justify-center min-h-full">
          <p>Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (displayError) {
    return (
      <Card className="p-6 bg-black/10 shadow-none min-h-full">
        <CardContent className="p-0 flex items-center justify-center min-h-full text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-3">👥</div>
            <p className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              Employee distribution temporarily unavailable: <br />
              <span className="font-semibold">{displayError}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalEmployees = employeeData.reduce(
    (acc, item) => acc + item.value,
    0
  );

  return (
    <Card className="p-6 bg-black/10 shadow-none min-h-full">
      <CardContent className="p-0 space-y-4">
        <div className="text-2xl font-bold">
          {totalEmployees}{" "}
          <span className="font-normal text-base">Employees</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {employeeData.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span>{item.name}</span>
                <span>{item.value}</span>
              </div>
              <Progress
                value={(item.value / totalEmployees) * 100}
                className="h-2 bg-black/15 [&>div]:bg-[#6b767f]"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeDistributionChart;
