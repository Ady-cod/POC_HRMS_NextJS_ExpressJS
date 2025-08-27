"use client";

import React, { useState, useEffect, useRef } from "react";
import DataTable from "react-data-table-component";
import { EmployeeListItem } from "@/types/types";
import dynamic from "next/dynamic";
import { useEmployeeTableColumns } from "@/hooks/useEmployeeTableColumns";
import { ColumnConfig } from "@/types/columnConfig";
import Image from "next/image";

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

  // Loading / timeout state machine (internal only)
  const [isLoading, setIsLoading] = useState(true); // start loading immediately
  const [isServerTimeout, setIsServerTimeout] = useState(false);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false); // becomes true after the first *prop change* from parent

  // Refs to help detect the first real "response arrived" without involving parent
  const mountedRef = useRef(false);
  const prevEmployeesRef = useRef<EmployeeListItem[] | null>(null);
  const serverTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const deflickerId = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect screen size changes
  useEffect(() => {
    setIsSmallScreen(window.innerWidth < 640);
    const handleResize = () => setIsSmallScreen(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Start a server-timeout only until we acknowledge the first response (any content, even empty)
  useEffect(() => {
    if (hasFetchedOnce) return;

    setIsLoading(true);
    setIsServerTimeout(false);

    serverTimeoutId.current = setTimeout(() => {
      if (!hasFetchedOnce) {
        setIsLoading(false);
        setIsServerTimeout(true);
      }
    }, 10000); // 10s: safer for cold starts

    return () => {
      if (serverTimeoutId.current) clearTimeout(serverTimeoutId.current);
    };
  }, [hasFetchedOnce]);

  // Acknowledge the first *prop* update from parent as "response arrived" (even if array is empty)
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      prevEmployeesRef.current = employees;

      // If data is already present on first render, acknowledge immediately
      if (Array.isArray(employees) && employees.length > 0 && !hasFetchedOnce) {
        setHasFetchedOnce(true);
        if (serverTimeoutId.current) clearTimeout(serverTimeoutId.current);
      }
      return;
    }

    // If the reference changes later, acknowledge the response (even if empty)
    if (!hasFetchedOnce && prevEmployeesRef.current !== employees) {
      prevEmployeesRef.current = employees;
      setHasFetchedOnce(true);
      if (serverTimeoutId.current) clearTimeout(serverTimeoutId.current);
    } else {
      prevEmployeesRef.current = employees;
    }
  }, [employees, hasFetchedOnce]);

  useEffect(() => {
    if (!hasFetchedOnce) return;

    deflickerId.current = setTimeout(() => {
      setIsLoading(false);
      setIsServerTimeout(false);
    }, 300);

    return () => {
      if (deflickerId.current) clearTimeout(deflickerId.current);
    };
  }, [hasFetchedOnce]);

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
        // Only loading/timeout control the overlay now (empty employee list state moved to noDataComponent)
        progressPending={isLoading || isServerTimeout}
        progressComponent={
          <div
            role="status"
            className="flex flex-col items-center justify-center py-8 text-[#646d7d]"
          >
            {isLoading ? (
              <>
                <div
                  aria-hidden="true"
                  className="w-10 h-10 border-4 border-current border-t-transparent rounded-full animate-spin"
                />
                <p className="mt-3 font-medium text-base">Loading employees…</p>
              </>
            ) : (
              <>
                <p
                  aria-live="assertive"
                  className="mt-3 text-red-600 font-medium text-base"
                >
                  Server is not responding. Check your internet connection and
                  try again or contact support.
                </p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-3 rounded-xl px-3 py-1.5 text-sm font-medium border border-red-300 hover:bg-red-50"
                >
                  Retry
                </button>
              </>
            )}
          </div>
        }
        // Proper empty state after we've stopped loading and there is no timeout
        noDataComponent={
          !isLoading && !isServerTimeout ? (
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="flex flex-col items-center justify-center py-10 text-[#646d7d] text-center"
            >
              <p className="font-semibold text-lg">
                No employee records to display.
              </p>
              <p className="mb-8">
                If filters are applied, clear or adjust them to see results.
              </p>
              <Image
                src="/images/no-results.svg"
                alt=""
                aria-hidden="true"
                width={160}
                height={120}
                className="mb-3 opacity-90"
              />
            </div>
          ) : null
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
