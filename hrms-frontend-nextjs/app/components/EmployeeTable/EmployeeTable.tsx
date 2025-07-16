import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import { getAllEmployees, deleteEmployee } from "@/actions/employee";
import { EmployeeListItem } from "@/types/types";
import { showToast } from "@/utils/toastHelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

import dynamic from "next/dynamic";
import EmployeeSearchFilters, { FilterState } from "@/components/EmployeeSearchFilters/EmployeeSearchFilters";
import { useCSVExport } from "@/hooks/useCSVExport";
import { useEmployeeTableColumns } from "@/hooks/useEmployeeTableColumns";

// Dynamically import the ConfirmationModal component to keep the initial bundle size small
const ConfirmationModal = dynamic(
  () => import("@/components/ConfirmationModal/ConfirmationModal"),
  {
    ssr: false,
  }
);

interface EmployeeTableProps {
  refreshFlag: boolean;
  handleEdit: (employeeData: EmployeeListItem) => void;
  setEmployeeCount: (count: number) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  refreshFlag,
  handleEdit,
  setEmployeeCount,
}) => {
  const [employees, setEmployees] = useState<EmployeeListItem[]>([]);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeColumnIndex, setActiveColumnIndex] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false); // Track screen size
  const [showDialog, setShowDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeListItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // Consolidated filter state
  const [filterState, setFilterState] = useState<FilterState>({
    searchText: "",
    searchCategory: "",
    selectedRole: "",
    selectedDepartment: "",
    selectedStartDate: "",
    selectedEndDate: "",
    selectedStartDOB: "",
    selectedEndDOB: "",
    selectedStatus: "",
  });

  // Helper function to update filter state
  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilterState(prev => ({ ...prev, [key]: value }));
  };

  // Helper function to clear all filters
  const clearAllFilters = () => {
    setFilterState({
      searchText: "",
      searchCategory: "",
      selectedRole: "",
      selectedDepartment: "",
      selectedStartDate: "",
      selectedEndDate: "",
      selectedStartDOB: "",
      selectedEndDOB: "",
      selectedStatus: "",
    });
  };

  // Utility function for consistent date formatting
  const formatDate = (dateString: string, format: 'display' | 'csv' = 'display'): string => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (format === 'csv') {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `'${day}-${month}-${year}`;
      }
      // Default display format (YYYY-MM-DD for consistency)
      return date.toISOString().split("T")[0];
    } catch {
      return "N/A";
    }
  };

  // CSV Export functionality
  const { exportToCSV } = useCSVExport({ formatDate });

  useEffect(() => {
    // Set the initial state for the  screen size based on the window width
    setIsSmallScreen(window.innerWidth < 640);

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize); // Cleanup on unmount
  }, []);

  useEffect(() => {
    async function fetchEmployees() {
      const employees = await getAllEmployees();
      setEmployees(employees);
      setEmployeeCount(employees.length);
    }
    fetchEmployees();
  }, [refreshFlag, setEmployeeCount]);

  const handleDeleteClick = (employee: EmployeeListItem) => {
    setSelectedEmployee(employee);
    setShowDialog(true);
  };

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
      // console.log("Delete successful:", response.message);

      // Show a success toast message
      showToast("success", "Success!", [
        `Employee "${selectedEmployee?.fullName}" deleted successfully!`,
      ]);

      // Update the UI on successful deletion
      const updatedEmployees = employees.filter((emp) => emp.id !== selectedEmployee.id);
      setEmployees(updatedEmployees);
      setEmployeeCount(updatedEmployees.length);
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
        console.error(
          "Error deleting employee, unexpected error occured: ",
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

  // Column definitions
  const { columns } = useEmployeeTableColumns({
    currentPage,
    rowsPerPage,
    handleEdit,
    handleDeleteClick,
    formatDate,
    isSmallScreen,
    activeSectionIndex,
    activeColumnIndex,
    setActiveSectionIndex,
    setActiveColumnIndex,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (currentRowsPerPage: number) => {
    setRowsPerPage(currentRowsPerPage);
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  const filteredEmployees = useMemo(() => {
    const { 
      searchCategory, 
      searchText, 
      selectedRole, 
      selectedDepartment, 
      selectedStatus,
      selectedStartDate,
      selectedEndDate,
      selectedStartDOB,
      selectedEndDOB
    } = filterState;
    
    if (searchCategory === "all" || searchCategory === "") {
      return employees;
    }

    if (
      (searchCategory === "name" || searchCategory === "email") &&
      !searchText
    ) {
      return employees;
    }

    if (searchCategory === "role" && !selectedRole) {
      return employees;
    }

    if (searchCategory === "department" && !selectedDepartment) {
      return employees;
    }

    if (searchCategory === "status" && !selectedStatus) {
      return employees;
    }

    const lowercasedSearchText = searchText.toLowerCase();

    return employees.filter((employee) => {
      let valueToSearch = "";

      switch (searchCategory) {
        case "name":
          valueToSearch = employee.fullName || "";
          break;

        case "email":
          valueToSearch = employee.email || "";
          break;

        case "dateOfJoining":
          if (employee.dateOfJoining) {
            const employeeDate = formatDate(employee.dateOfJoining);
            if (employeeDate === "N/A") return false;

            if (selectedStartDate && selectedEndDate) {
              return (
                employeeDate >= selectedStartDate &&
                employeeDate <= selectedEndDate
              );
            } else if (selectedStartDate) {
              return employeeDate >= selectedStartDate;
            } else if (selectedEndDate) {
              return employeeDate <= selectedEndDate;
            } else {
              return true;
            }
          }
          return false;

        case "dateOfBirth":
          if (employee.birthDate) {
            const dob = formatDate(employee.birthDate);
            if (dob === "N/A") return false;

            if (selectedStartDOB && selectedEndDOB) {
              return dob >= selectedStartDOB && dob <= selectedEndDOB;
            } else if (selectedStartDOB) {
              return dob >= selectedStartDOB;
            } else if (selectedEndDOB) {
              return dob <= selectedEndDOB;
            } else {
              return true;
            }
          }
          return false;

        case "status":
          return employee.status === selectedStatus;

        case "role":
          return employee.role === selectedRole;

        case "department":
          return employee.department?.name === selectedDepartment;

        default:
          return true;
      }

      return valueToSearch.toLowerCase().includes(lowercasedSearchText);
    });
  }, [employees, filterState]);





  return (
    <div>
      {/* Search and Filter Controls */}
      <EmployeeSearchFilters
        filterState={filterState}
        updateFilter={updateFilter}
        clearAllFilters={clearAllFilters}
        employees={employees}
      />
      {/* Export Button */}
      <div className="flex justify-start mb-4 px-3">
        <button
          onClick={() => exportToCSV(filteredEmployees)}
          className="flex items-center gap-2 bg-gray-400 hover:opacity-90 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
        >
          Export it into CSV file
          <FontAwesomeIcon icon={faDownload} />
        </button>
      </div>

      {/* Data Table */}
      <div>
        <DataTable
          fixedHeaderScrollHeight="calc(100vh - 130px - 60px)"
          columns={columns}
          data={filteredEmployees}
          pagination
          paginationPerPage={rowsPerPage}
          paginationRowsPerPageOptions={[10, 25, 50, 100]}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          responsive
          fixedHeader
        />
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        description={`Are you sure you want to delete "${selectedEmployee?.fullName}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default EmployeeTable;
