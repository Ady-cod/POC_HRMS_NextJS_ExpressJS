import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { EmployeeListItem } from "@/types/types";
import dynamic from "next/dynamic";
import { useEmployeeTableColumns } from "@/hooks/useEmployeeTableColumns";
import { ColumnConfig } from "@/types/columnConfig";

const ConfirmationModal = dynamic(
  () => import("@/components/ConfirmationModal/ConfirmationModal"),
  { ssr: false }
);

interface EmployeeTableProps {
  employees: EmployeeListItem[];
  handleEdit: (employeeData: EmployeeListItem) => void;
  handleDeleteClick: (employee: EmployeeListItem) => void;
  selectedEmployee: EmployeeListItem | null;
  showDialog: boolean;
  confirmDelete: () => void;
  closeDeleteDialog: () => void;
  columnConfig?: ColumnConfig;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  handleEdit,
  handleDeleteClick,
  selectedEmployee,
  showDialog,
  confirmDelete,
  closeDeleteDialog,
  columnConfig,
}) => {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeColumnIndex, setActiveColumnIndex] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [isServerTimeout, setIsServerTimeout] = useState(false);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  // Detect screen size changes
  useEffect(() => {
    setIsSmallScreen(window.innerWidth < 640);
    const handleResize = () => setIsSmallScreen(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Loading + Server timeout detection
  useEffect(() => {
    if (employees.length === 0 && !hasFetchedOnce) {
      // Still waiting for first server response
      setIsLoading(true);
      setIsServerTimeout(false);

      const timeoutId = setTimeout(() => {
        setIsLoading(false);
        setIsServerTimeout(true);
      }, 5000);

      return () => clearTimeout(timeoutId);
    } else {
      // We have received at least one response from the server
      setHasFetchedOnce(true);

      const shortDelay = setTimeout(() => {
        setIsLoading(false);
        setIsServerTimeout(false);
      }, 300);

      return () => clearTimeout(shortDelay);
    }
  }, [employees, hasFetchedOnce]);

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

  return (
    <div>
      <DataTable
        fixedHeaderScrollHeight="calc(100vh - 130px - 60px)"
        columns={columns}
        data={employees}
        pagination
        paginationPerPage={rowsPerPage}
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        onChangePage={setCurrentPage}
        onChangeRowsPerPage={setRowsPerPage}
        responsive
        fixedHeader
        progressPending={isLoading || isServerTimeout || employees.length === 0}
        progressComponent={
          <div className="flex flex-col items-center justify-center py-8">
            {isLoading ? (
              <>
                <div className="w-10 h-10 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-3 text-gray-600 font-medium text-sm">
                  Loading employees...
                </p>
              </>
            ) : isServerTimeout ? (
              <>
                <p className="mt-3 text-red-600 font-medium text-sm">
                  Server is not responding. Please try again later.
                </p>
              </>
            ) : (
              <p className="mt-3 text-gray-600 font-medium text-sm">
                No employees found.
              </p>
            )}
          </div>
        }
      />

      <ConfirmationModal
        isOpen={showDialog}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        description={`Are you sure you want to delete "${selectedEmployee?.fullName}"?`}
      />
    </div>
  );
};

export default EmployeeTable;
