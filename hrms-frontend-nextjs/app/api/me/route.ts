import { getOptionalAuth } from "@/utils/auth";
import { getAllEmployees } from "@/actions/employee";
import { NextResponse } from "next/server";

export async function GET() {
  const user = getOptionalAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const employees = await getAllEmployees();
  const employee = employees.find((emp) => emp.id === user.employeeId);

  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  return NextResponse.json(employee, { status: 200 });
}
