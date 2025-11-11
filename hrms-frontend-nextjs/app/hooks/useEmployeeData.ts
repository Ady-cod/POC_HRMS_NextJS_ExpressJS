import { useState, useEffect } from 'react';
import { getAllEmployees, deleteEmployee } from '@/actions/employee';
import { EmployeeListItem } from '@/types/types';
import { showToast } from '@/utils/toastHelper';

interface UseEmployeeDataProps {
  refreshFlag: boolean;
  setEmployeeCount: (count: number) => void;
}

export const useEmployeeData = ({ refreshFlag, setEmployeeCount }: UseEmployeeDataProps) => {
  const [employees, setEmployees] = useState<EmployeeListItem[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeListItem | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  // Fetch employees data
  useEffect(() => {
    async function fetchEmployees() {
      const employees = await getAllEmployees();
      setEmployees(employees);
      setEmployeeCount(employees.length);
    }
    fetchEmployees();
  }, [refreshFlag, setEmployeeCount]);

  // Handle delete button click
  const handleDeleteClick = (employee: EmployeeListItem) => {
    setSelectedEmployee(employee);
    setShowDialog(true);
  };

  // Confirm and execute employee deletion
  const confirmDelete = async () => {
    if (!selectedEmployee) {
      console.error("No employee selected for deletion");
      setShowDialog(false);

      showToast("error", "Failed to delete employee!", [
        "No employee selected for deletion",
      ]);
      return;
    }

    try {
      await deleteEmployee(selectedEmployee.id);

      // Show success toast message
      showToast("success", "Success!", [
        `Employee "${selectedEmployee?.fullName}" deleted successfully!`,
      ]);

      // Update the UI on successful deletion
      const updatedEmployees = employees.filter((emp) => emp.id !== selectedEmployee.id);
      setEmployees(updatedEmployees);
      setEmployeeCount(updatedEmployees.length);
    } catch (err) {
      if (err instanceof Error) {
        // Display the regular error message
        const errorMessages = err.message.split("\n");
        showToast("error", "Failed to delete employee!", errorMessages);
      } else if (
        err &&
        typeof err === "object" &&
        "status" in err &&
        "message" in err
      ) {
        // Handle custom error object thrown from `deleteEmployee`
        const errorMessage = err.message;
        showToast("error", "Failed to delete employee!", [
          `Status: ${err.status}`,
          errorMessage as string,
        ]);
      } else {
        // Fallback for unknown errors
        console.error(
          "Error deleting employee, unexpected error occurred: ",
          err
        );

        // Display a generic error message
        showToast("error", "Failed to delete employee!", [
          "An unknown error occurred",
        ]);
      }
    } finally {
      setShowDialog(false);
      setSelectedEmployee(null);
    }
  };

  // Close delete confirmation dialog
  const closeDeleteDialog = () => {
    setShowDialog(false);
    setSelectedEmployee(null);
  };

  return {
    employees,
    setEmployees,
    selectedEmployee,
    showDialog,
    handleDeleteClick,
    confirmDelete,
    closeDeleteDialog,
  };
}; 