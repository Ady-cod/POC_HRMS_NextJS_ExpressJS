"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getAllEmployees } from "@/actions/employee";
import { showToast } from "@/utils/toastHelper";

type TransformedEmployeeData = {
  name: string;
  value: number;
};

const EmployeeOverview = () => {
  const [employeeData, setEmployeeData] = useState<TransformedEmployeeData[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const employees = await getAllEmployees();
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
        setError("Error fetching employee data");
        showToast("error", "Error!", [`Error fetching employee data: ${err}`]);
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  const totalEmployees = employeeData.reduce(
    (acc, item) => acc + item.value,
    0
  );

  return (
    <Card className="p-6 bg-black/10 shadow-none min-h-[430px]">
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
                className="h-2 bg-black/15"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeOverview;
