import React, { useState, useEffect, useMemo } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { getAllEmployees, deleteEmployee } from "@/actions/employee";
import { EmployeeListItem } from "@/types/types";
import { showToast } from "@/utils/toastHelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faForwardStep,
  faAngleLeft,
  faAngleRight,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";

import dynamic from "next/dynamic";
import { Trash2, Pencil } from "lucide-react";
import EmployeeSearchFilters, { FilterState } from "@/components/EmployeeSearchFilters/EmployeeSearchFilters";

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

  const handleExportToCSV = () => {
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

    // Helper function to format null/undefined values
    const formatValue = (value: string | null | undefined): string => {
      if (!value) return "N/A";
      return value;
    };

    // Build CSV rows from employees
    const rows = filteredEmployees.map((emp) => [
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
    link.setAttribute("download", "employees.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const firstColumns: TableColumn<EmployeeListItem>[] = [
    {
      name: "SNo.",
      cell: (row: EmployeeListItem, index: number) => {
        const previousPages = currentPage - 1;
        // Calculate the correct row number by adding to the current position the previous pages raws if any
        return previousPages * rowsPerPage + index + 1;
      },
      width: "80px",
    },
    {
      name: "Full Name",
      selector: (employee) => employee.fullName || "N/A",
      sortable: true,
    },
  ];
  const lastColumn: TableColumn<EmployeeListItem> = {
    name: "Action",
    cell: (employee) => (
      <div className="flex items-center gap-2 whitespace-nowrap">
        {/* Edit Button */}
        <button
          onClick={() => handleEdit(employee)}
          className="flex items-center gap-1 text-sm text-gray-700 hover:text-black transition"
        >
          <Pencil size={18} />
          <span>Edit</span>
        </button>

        {/* Delete Button */}
        <button
          onClick={() => handleDeleteClick(employee)}
          className="flex items-center gap-1 text-sm text-gray-700 hover:text-black transition"
        >
          <Trash2 size={18} />
          <span>Delete</span>
        </button>
      </div>
    ),
  };
  const columnSections: TableColumn<EmployeeListItem>[][] = useMemo(
    () => [
      [
        {
          name: "Email",
          selector: (employee) => employee.email || "N/A",
          sortable: true,
        },
        {
          name: "Phone",
          selector: (employee) => employee.phoneNumber || "N/A",
          sortable: true,
        },
        {
          name: "Department",
          selector: (employee) => employee.department?.name || "N/A",
          sortable: true,
        },
      ],
      [
        {
          name: "Role",
          selector: (employee) => employee.role || "N/A",
          sortable: true,
        },
        {
          name: "Joining Date",
          selector: (employee) => formatDate(employee.dateOfJoining),
          sortable: true,
        },
        {
          name: "Status",
          selector: (employee) => employee.status || "N/A",
          sortable: true,
        },
      ],
      [
        {
          name: "Country",
          selector: (employee) => employee.country || "N/A",
          sortable: true,
        },
        {
          name: "City",
          selector: (employee) => employee.city || "N/A",
          sortable: true,
        },
        {
          name: "Address",
          selector: (employee) => employee.streetAddress || "N/A",
          sortable: true,
        },
      ],
      [
        {
          name: "Birthday",
          selector: (employee) => formatDate(employee.birthDate),
          sortable: true,
        },
        {
          name: "Gender",
          selector: (employee) => employee.gender || "N/A",
          sortable: true,
        },
        {
          name: "Full Onboarding",
          selector: (employee) => (employee.inductionCompleted ? "Yes" : "No"),
          sortable: true,
        },
      ],
    ],
    []
  );

  const columnSectionsExpanded = useMemo(
    () => columnSections.flat(),
    [columnSections]
  );

  const toggleColumn: TableColumn<EmployeeListItem> = {
    name: "More columns ...",
    cell: () => (
      <div className="flex justify-center items-center gap-4 my-1 text-gray-500">
        <button
          onClick={() =>
            isSmallScreen ? setActiveColumnIndex(0) : setActiveSectionIndex(0)
          }
          disabled={
            isSmallScreen ? activeColumnIndex === 0 : activeSectionIndex === 0
          }
          className="disabled:opacity-50"
          aria-label="First"
        >
          <FontAwesomeIcon icon={faBackwardStep} size="lg" />
        </button>
        <button
          onClick={() =>
            isSmallScreen
              ? setActiveColumnIndex((prev) => Math.max(prev - 1, 0))
              : setActiveSectionIndex((prev) => Math.max(prev - 1, 0))
          }
          disabled={
            isSmallScreen ? activeColumnIndex === 0 : activeSectionIndex === 0
          }
          className="disabled:opacity-50"
          aria-label="Previous"
        >
          <FontAwesomeIcon icon={faAngleLeft} size="lg" />
        </button>
        <button
          onClick={() =>
            isSmallScreen
              ? setActiveColumnIndex((prev) =>
                  Math.min(prev + 1, columnSectionsExpanded.length - 1)
                )
              : setActiveSectionIndex((prev) =>
                  Math.min(prev + 1, columnSections.length - 1)
                )
          }
          disabled={
            isSmallScreen
              ? activeColumnIndex === columnSectionsExpanded.length - 1
              : activeSectionIndex === columnSections.length - 1
          }
          className="disabled:opacity-50"
          aria-label="Next"
        >
          <FontAwesomeIcon icon={faAngleRight} size="lg" />
        </button>
        <button
          onClick={() =>
            isSmallScreen
              ? setActiveColumnIndex(columnSectionsExpanded.length - 1)
              : setActiveSectionIndex(columnSections.length - 1)
          }
          disabled={
            isSmallScreen
              ? activeColumnIndex === columnSectionsExpanded.length - 1
              : activeSectionIndex === columnSections.length - 1
          }
          className="disabled:opacity-50"
          aria-label="Last"
        >
          <FontAwesomeIcon icon={faForwardStep} size="lg" />
        </button>
      </div>
    ),
  };

  const columns = isSmallScreen
    ? [
        ...firstColumns,
        columnSectionsExpanded[activeColumnIndex],
        toggleColumn,
        lastColumn,
      ]
    : [
        ...firstColumns,
        ...columnSections[activeSectionIndex],
        toggleColumn,
        lastColumn,
      ];

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
          onClick={handleExportToCSV}
          style={{ backgroundColor: "#a7aeb4" }}
          className="flex items-center gap-2 text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition duration-200"
        >
          Export It into CSV file
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
