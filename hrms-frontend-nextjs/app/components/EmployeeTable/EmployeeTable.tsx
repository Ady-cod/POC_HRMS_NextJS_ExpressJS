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
      <DataTable
        columns={columns}
        data={employees}
        pagination
        paginationPerPage={rowsPerPage}
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleRowsPerPageChange}
        responsive
        fixedHeader
      />
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
