import React, { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { getAllEmployees, deleteEmployee } from "@/actions/employee";
import { EmployeeListItem } from "@/types/types";
import { showToast } from "@/utils/toastHelper";

interface EmployeeTableProps {
  refreshFlag: boolean;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ refreshFlag }) => {
  const [employees, setEmployees] = useState<EmployeeListItem[]>([]);

  useEffect(() => {
    async function fetchEmployees() {
      const employees = await getAllEmployees();
      setEmployees(employees);
    }
    fetchEmployees();
  }, [refreshFlag]);

  const handleDelete = async (id: string) => {
    const employee = employees.find((emp) => emp.id === id); // Find employee by ID
    try {
      const response = await deleteEmployee(id);
      console.log("Delete successful:", response.message);

      // Show a success toast message
      showToast("success", "Employee Deleted!", [
        `You deleted ${employee?.fullName || "an employee"}`,
      ]);

      // Update the UI on successful deletion
      setEmployees(employees.filter((employee) => employee.id !== id));

    } catch (err) {
      if (err instanceof Error) {
        console.error("Error deleting employee:", err.message);

        // Display the regular error message
        const errorMessages = err.message.split("\n");
        showToast("error", "Failed to delete employee!", errorMessages);

      } else {
        console.error("Error deleting employee:", "An error occurred");

        // Display a generic error message
        showToast("error", "Failed to delete employee!", [
          "An unknown error occurred",
        ]);
      }
    }
  };
  const handleEdit = () => {};

  const columns: TableColumn<EmployeeListItem>[] = [
    {
      name: "SNo.",
      selector: (row) => row.id,
      cell: (id, row) => row + 1,
      sortable: true,
    },
    {
      name: "Full Name",
      selector: (row) => row.fullName || "N/A",
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email || "N/A",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status || "N/A",
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.role || "N/A",
      sortable: true,
    },
    {
      name: "Action",

      sortable: true,
      cell: (row) => (
        <>
          <button onClick={handleEdit} className="bg-green-500 rounded-lg p-2">
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="bg-red-500  rounded-lg p-2 ms-2"
          >
            Delete
          </button>
        </>
      ),
    },
  ];
  return (
    <div>
      <DataTable columns={columns} data={employees} />
    </div>
  );
};

export default EmployeeTable;
