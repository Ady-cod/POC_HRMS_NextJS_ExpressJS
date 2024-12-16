import React, { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { getAllEmployees, deleteEmployee } from "@/actions/employee";
import { EmployeeListItem } from "@/types/types";
import { showToast } from "@/utils/toastHelper";

interface EmployeeTableProps {
  refreshFlag: boolean;
  handleEdit: (employeeData: EmployeeListItem) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ refreshFlag, handleEdit }) => {
  const [employees, setEmployees] = useState<EmployeeListItem[]>([]);

  useEffect(() => {
    async function fetchEmployees() {
      const employees = await getAllEmployees();
      setEmployees(employees);
    }
    fetchEmployees();
  }, [refreshFlag]);

  const handleDelete = async (employee: EmployeeListItem) => {
    try {
      await deleteEmployee(employee.id);
      // console.log("Delete successful:", response.message);

      // Show a success toast message
      showToast("success", "Success!", [
        `Employee "${employee?.fullName}" deleted successfully!`,
      ]);

      // Update the UI on successful deletion
      setEmployees(employees.filter((emp) => emp.id !== employee.id));

    } catch (err) {
      if (err instanceof Error) {
        // console.error("Error deleting employee:", err.message);

        // Display the regular error message
        const errorMessages = err.message.split("\n");
        showToast("error", "Failed to delete employee!", errorMessages);
      } else if (
        err &&
        typeof err === "object" &&
        "status" in err &&
        "message" in err
      ) {
        // Handle custom error object thrown from `deleteEmployee` and display its properties
        const errorMessage = err.message;
        showToast("error", "Failed to delete employee!", [
          `Status: ${err.status}`,
          errorMessage as string,
        ]);
      } else {
        // Fallback for unknown errors
        console.error("Error deleting employee, unexpected error occured: ", err);

        // Display a generic error message
        showToast("error", "Failed to delete employee!", [
          "An unknown error occurred",
        ]);
      }
    }
  };

  const columns: TableColumn<EmployeeListItem>[] = [
    {
      name: "SNo.",
      cell: (_, rowIndex) => rowIndex + 1,
    },
    {
      name: "Full Name",
      selector: (employee) => employee.fullName || "N/A",
      sortable: true,
    },
    {
      name: "Email",
      selector: (employee) => employee.email || "N/A",
      sortable: true,
    },
    {
      name: "Status",
      selector: (employee) => employee.status || "N/A",
      sortable: true,
    },
    {
      name: "Role",
      selector: (employee) => employee.role || "N/A",
      sortable: true,
    },
    {
      name: "Action",
      cell: (employee) => (
        <>
          <button
            onClick={() => handleEdit(employee)}
            className="bg-green-500 rounded-lg p-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(employee)}
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
