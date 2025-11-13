import { useState, useEffect } from "react";
import { getAllDepartments, deleteDepartment } from "@/actions/department";
import { DepartmentListItem } from "@/types/types";
import { showToast } from "@/utils/toastHelper";

interface UseDepartmentDataProps {
  refreshFlag: boolean;
  setDepartmentCount: (count: number) => void;
}

export const useDepartmentData = ({ refreshFlag, setDepartmentCount }: UseDepartmentDataProps) => {
  const [departments, setDepartments] = useState<DepartmentListItem[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentListItem | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  // Fetch departments
  useEffect(() => {
    async function fetchDepartments() {
      const departments = await getAllDepartments();
      setDepartments(departments);
      setDepartmentCount(departments.length);
    }
    fetchDepartments();
  }, [refreshFlag, setDepartmentCount]);

  // Handle delete button click
  const handleDeleteClick = (department: DepartmentListItem) => {
    setSelectedDepartment(department);
    setShowDialog(true);
  };

  // Confirm and execute deletion
  const confirmDelete = async () => {
    if (!selectedDepartment){
      console.error("No department selected for deletion");
      setShowDialog(false);

      showToast("error", "Failed to delete department!", [
        "No department selected for deletion",
      ]);
      return;
    }

    try {
      await deleteDepartment(selectedDepartment.id);
      showToast("success", "Deleted!", [
        `Department "${selectedDepartment.name}" deleted successfully.`,
      ]);

      const updatedDepartments = departments.filter(
        (dept) => dept.id !== selectedDepartment.id
      );
      setDepartments(updatedDepartments);
      setDepartmentCount(updatedDepartments.length);
    } catch (err) {
      if (err instanceof Error) {
        // Display the regular error message
        const errorMessages = err.message.split("\n");
        showToast("error", "Failed to delete department!", errorMessages);
      } else if (
        err &&
        typeof err === "object" &&
        "status" in err &&
        "message" in err
      ) {
        // Handle custom error object thrown from `deleteDepartment`
        const errorMessage = err.message;
        showToast("error", "Failed to delete department!", [
          `Status: ${err.status}`,
          errorMessage as string,
        ]);
      } else {
        // Fallback for unknown errors
        console.error(
          "Error deleting department, unexpected error occurred: ",
          err
        );

        // Display a generic error message
        showToast("error", "Failed to delete department!", [
          "An unknown error occurred",
        ]);
      }
    } finally {
      setSelectedDepartment(null);
      setShowDialog(false);
    }
  };

  // Close delete dialog
  const closeDeleteDialog = () => {
    setSelectedDepartment(null);
    setShowDialog(false);
  };

  return {
    departments,
    setDepartments,
    selectedDepartment,
    showDialog,
    handleDeleteClick,
    confirmDelete,
    closeDeleteDialog,
  };
};