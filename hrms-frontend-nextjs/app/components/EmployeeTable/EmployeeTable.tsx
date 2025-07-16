import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import { EmployeeListItem } from "@/types/types";
import { formatDate } from "@/utils/dateUtils";
import { ColumnConfig } from "@/types/columnConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

import dynamic from "next/dynamic";
import EmployeeSearchFilters, { FilterState } from "@/components/EmployeeSearchFilters/EmployeeSearchFilters";
import { useCSVExport } from "@/hooks/useCSVExport";
import { useEmployeeTableColumns } from "@/hooks/useEmployeeTableColumns";
import { useEmployeeData } from "@/hooks/useEmployeeData";

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
  columnConfig?: ColumnConfig;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  refreshFlag,
  handleEdit,
  setEmployeeCount,
  columnConfig,
}) => {
  // Employee data management
  const {
    employees,
    selectedEmployee,
    showDialog,
    handleDeleteClick,
    confirmDelete,
    closeDeleteDialog,
  } = useEmployeeData({ refreshFlag, setEmployeeCount });

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeColumnIndex, setActiveColumnIndex] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false); // Track screen size
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



  // CSV Export functionality
  const { exportToCSV } = useCSVExport();

  useEffect(() => {
    // Set the initial state for the  screen size based on the window width
    setIsSmallScreen(window.innerWidth < 640);

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize); // Cleanup on unmount
  }, []);

  // Column definitions
  const { columns } = useEmployeeTableColumns({
    currentPage,
    rowsPerPage,
    handleEdit,
    handleDeleteClick,
    isSmallScreen,
    activeSectionIndex,
    activeColumnIndex,
    setActiveSectionIndex,
    setActiveColumnIndex,
    columnConfig,
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
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        description={`Are you sure you want to delete "${selectedEmployee?.fullName}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default EmployeeTable;
