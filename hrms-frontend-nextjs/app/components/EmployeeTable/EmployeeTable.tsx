import React, { useState, useEffect, useMemo } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { getAllEmployees, deleteEmployee } from "@/actions/employee";
import { EmployeeListItem } from "@/types/types";
import { showToast } from "@/utils/toastHelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EmployeeRole } from "@/types/types";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import {
  faBackwardStep,
  faForwardStep,
  faAngleLeft,
  faAngleRight,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

import dynamic from "next/dynamic";

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
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  refreshFlag,
  handleEdit,
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
  const [searchText, setSearchText] = useState(""); // NEW: State for search term
  const [searchCategory, setSearchCategory] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");

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
    }
    fetchEmployees();
  }, [refreshFlag]);

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
      setEmployees(employees.filter((emp) => emp.id !== selectedEmployee.id));
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
    // If "All Categories" is selected, return all employees
    if (searchCategory === "all" || searchCategory === "") {
      return employees;
    }

    // If no search input or selected value for the current category, return all employees
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
            try {
              const employeeDate = new Date(employee.dateOfJoining)
                .toISOString()
                .split("T")[0];

              // Apply filtering based on selected date(s)
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
            } catch (error) {
              console.error(
                "Error parsing dateOfJoining for employee:",
                employee,
                error
              );
              return false;
            }
          }
          return false;

        case "role":
          return employee.role === selectedRole;

        case "department":
          return employee.department?.name === selectedDepartment;

        default:
          return true;
      }

      // For name and email categories — perform case-insensitive match
      return valueToSearch.toLowerCase().includes(lowercasedSearchText);
    });
  }, [
    employees,
    searchText,
    searchCategory,
    selectedRole,
    selectedDepartment,
    selectedStartDate,
    selectedEndDate,
  ]);

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
      <>
        <button
          onClick={() => handleEdit(employee)}
          className="bg-green-500 rounded-lg p-2 whitespace-nowrap"
        >
          Edit
        </button>
        <button
          onClick={() => handleDeleteClick(employee)}
          className="bg-red-500  rounded-lg p-2 ms-2 whitespace-nowrap"
        >
          Delete
        </button>
      </>
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
          selector: (employee) => employee.dateOfJoining.split("T")[0] || "N/A",
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
          selector: (employee) => employee.birthDate.split("T")[0] || "N/A",
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
      {/* Search Bar container with dropdown */}
      <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-gray-100 rounded-md shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Category Dropdown */}
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="w-48 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
          >
            <option value="" disabled>
              Search By Category
            </option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="dateOfJoining">Date of Joining</option>
            <option value="role">Role</option>
            <option value="department">Department</option>
          </select>

          {/* Conditional Inputs */}
          {searchCategory === "name" || searchCategory === "email" ? (
            <div className="relative w-60">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder={`Search by ${searchCategory
                  .replace(/([A-Z])/g, " $1")
                  .toLowerCase()
                  .replace(/^./, (str) => str.toUpperCase())}...`}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : searchCategory === "role" ? (
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-60 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">All Roles</option>
              {Object.values(EmployeeRole).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          ) : searchCategory === "department" ? (
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-60 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">All Departments</option>
              {Array.from(
                new Set(
                  employees
                    .map((emp) => emp.department?.name)
                    .filter((name): name is string => Boolean(name))
                )
              ).map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          ) : searchCategory === "dateOfJoining" ? (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={selectedStartDate}
                onChange={(e) => setSelectedStartDate(e.target.value)}
                className="w-40 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-600 text-sm font-medium">to</span>
              <input
                type="date"
                value={selectedEndDate}
                onChange={(e) => setSelectedEndDate(e.target.value)}
                className="w-40 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : null}

          {/* Conditionally Render Remove Filter Button */}
          {(searchCategory ||
            searchText ||
            selectedRole ||
            selectedDepartment ||
            selectedStartDate ||
            selectedEndDate) && (
            <button
              onClick={() => {
                setSearchCategory("");
                setSearchText("");
                setSelectedRole("");
                setSelectedDepartment("");
                setSelectedStartDate("");
                setSelectedEndDate("");
              }}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
            >
              <FontAwesomeIcon icon={faArrowsRotate} />
              Remove Filters
            </button>
          )}
        </div>
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
