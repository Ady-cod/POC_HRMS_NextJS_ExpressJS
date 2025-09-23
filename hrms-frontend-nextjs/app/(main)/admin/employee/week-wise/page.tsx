"use client";
import React, { useState, useMemo } from "react";
import EmployeeTable from "@/components/EmployeeTable/EmployeeTable";
import EmployeeSearchFilters from "@/components/EmployeeSearchFilters/EmployeeSearchFilters";
import WeekSlider from "@/components/WeekSlider/WeekSlider";
import ExportCSVButton from "@/components/ExportCSVButton/ExportCSVButton";
import TotalCountButton from "@/components/TotalCountButton/TotalCountButton";
import { WEEK_WISE_COLUMN_CONFIG } from "@/types/columnConfig";
import { useEmployeeModal } from "@/hooks/useEmployeeModal";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import AddNewDataButton from "@/components/AddNewDataButton/AddNewDataButton";
import { 
  FilterState, 
  getInitialFilterState, 
  applyAllFilters 
} from "@/utils/employeeFilters";
import dynamic from "next/dynamic";

const ModalForm = dynamic(() => import("@/components/ModalForm/ModalForm"), {
  ssr: false,
});

const WeekWisePage = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [filterState, setFilterState] = useState<FilterState>(getInitialFilterState());

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

  // Apply filters to employees (including week filtering)
  const filteredEmployees = useMemo(() => {
    return applyAllFilters(employees, filterState, selectedWeek, true);
  }, [employees, filterState, selectedWeek]);

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-start gap-2 mt-6 mb-4 px-4">
        {/* Heading */}
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-darkblue-900">
          Week-wise Employee View
        </h2>

        {/* Button Group */}
        <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-3">
          <TotalCountButton count={employeeCount} />

          <AddNewDataButton onClick={openModalForAdd} />
        </div>
      </div>

      {/* Modal Form */}
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
      <div className="flex justify-start mb-14 px-3">
        <ExportCSVButton employees={filteredEmployees} />
      </div>

      {/* Week Slider */}
      <WeekSlider
        selectedWeek={selectedWeek}
        setSelectedWeek={setSelectedWeek}
      />

      {/* Employee Table */}
      <EmployeeTable
        employees={filteredEmployees}
        handleEdit={openModalForEdit}
        handleDeleteClick={handleDeleteClick}
        selectedEmployee={selectedEmployee}
        showDialog={showDialog}
        confirmDelete={confirmDelete}
        closeDeleteDialog={closeDeleteDialog}
        columnConfig={WEEK_WISE_COLUMN_CONFIG}
      />
    </div>
  );
};

export default WeekWisePage;
