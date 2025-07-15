import { useCallback } from 'react';
import { EmployeeListItem } from '@/types/types';

interface UseCSVExportProps {
  formatDate: (dateString: string, format?: 'display' | 'csv') => string;
}

export const useCSVExport = ({ formatDate }: UseCSVExportProps) => {
  // Helper function to format null/undefined values
  const formatValue = useCallback((value: string | null | undefined): string => {
    if (!value) return "N/A";
    return value;
  }, []);

  const exportToCSV = useCallback((data: EmployeeListItem[], filename: string = 'employees.csv') => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Country",
      "State",
      "City",
      "Address",
      "Birth Date",
      "Joining Date",
      "Department",
      "Role",
      "Status",
      "Gender",
    ];

    // Build CSV rows from employees
    const rows = data.map((emp) => [
      formatValue(emp.fullName),
      formatValue(emp.email),
      formatValue(emp.phoneNumber),
      formatValue(emp.country),
      formatValue(emp.state),
      formatValue(emp.city),
      formatValue(emp.streetAddress),
      formatDate(emp.birthDate, 'csv'),
      formatDate(emp.dateOfJoining, 'csv'),
      formatValue(emp.department?.name),
      formatValue(emp.role),
      formatValue(emp.status),
      formatValue(emp.gender),
    ]);

    // Combine headers and rows into CSV string
    const csvContent = [
      headers.join(","), // first row: headers
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")), // data rows
    ].join("\n");

    // Create Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    URL.revokeObjectURL(url);
  }, [formatDate, formatValue]);

  return { exportToCSV };
}; 