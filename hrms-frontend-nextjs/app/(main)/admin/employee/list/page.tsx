"use client";
import React, { useState, useMemo, useEffect } from "react";
import AddNewDataButton from "@/components/AddNewDataButton/AddNewDataButton";
import TotalCountButton from "@/components/TotalCountButton/TotalCountButton";
import EmployeeTable from "@/components/EmployeeTable/EmployeeTable";
import EmployeeSearchFilters from "@/components/EmployeeSearchFilters/EmployeeSearchFilters";
import ExportCSVButton from "@/components/ExportCSVButton/ExportCSVButton";
import { useEmployeeModal } from "@/hooks/useEmployeeModal";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { 
  FilterState, 
  getInitialFilterState, 
  applyAllFilters 
} from "@/utils/employeeFilters";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { showToast } from "@/utils/toastHelper";

// Dynamically import the ModalForm component to reduce the initial bundle size
const ModalForm = dynamic(() => import("@/components/ModalForm/ModalForm"), {
  ssr: false,
});

const EmployeePage = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [filterState, setFilterState] = useState<FilterState>(getInitialFilterState());

  const sp = useSearchParams();

useEffect(() => {
    if (sp.get("migrated") === "table") {
      showToast("success", "Page Migration", [
        "Heads up: the old \"admin/employee/table\" page moved to \"admin/employee/list\" ",
        "You’re in the right place!"
      ]);
    }
  }, [sp]);

  // Use the custom hook for modal management
  const {
    isModalOpen,
    employeeData,
    refreshFlag,
    openModalForAdd,
    openModalForEdit,
    closeModal,
    refreshEmployees,
  } = useEmployeeModal();

  // Use the employee data hook
  const {
    employees,
    selectedEmployee,
    showDialog,
    handleDeleteClick,
    confirmDelete,
    closeDeleteDialog,
  } = useEmployeeData({ refreshFlag, setEmployeeCount });

  // Filter state management
  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilterState((prev) => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilterState(getInitialFilterState());
  };

  // Apply filters to employees
  const filteredEmployees = useMemo(() => {
    return applyAllFilters(employees, filterState);
  }, [employees, filterState]);

  return (
    <div>
      <div className="flex flex-row flex-wrap justify-between items-center mt-6 mb-4 px-4 gap-2 sm:gap-4">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 whitespace-nowrap">
          List
        </h2>

        {/* Button Section */}
        <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-3">
          {/* Total Count Button */}
          <TotalCountButton count={employeeCount} />

          {/* Add New Data Button */}
          <AddNewDataButton onClick={openModalForAdd} />
        </div>
      </div>

      {/* Modal Form for adding new data */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={closeModal}
        refreshEmployees={refreshEmployees}
        employeeData={employeeData}
      />

      {/* Search Filters */}
      <EmployeeSearchFilters
        filterState={filterState}
        updateFilter={updateFilter}
        clearAllFilters={clearAllFilters}
        employees={employees}
      />

      {/* Export Button */}
      <div className="flex justify-start mb-4 px-3">
        <ExportCSVButton employees={filteredEmployees} />
      </div>

      {/* Table section */}
      <EmployeeTable
        employees={filteredEmployees}
        handleEdit={openModalForEdit}
        handleDeleteClick={handleDeleteClick}
        selectedEmployee={selectedEmployee}
        showDialog={showDialog}
        confirmDelete={confirmDelete}
        closeDeleteDialog={closeDeleteDialog}
      />
    </div>
  );
};

export default EmployeePage;
