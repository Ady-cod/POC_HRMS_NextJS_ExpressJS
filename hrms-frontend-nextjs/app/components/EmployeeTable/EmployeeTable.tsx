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

  useEffect(() => {
    setIsSmallScreen(window.innerWidth < 640);
    const handleResize = () => setIsSmallScreen(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
