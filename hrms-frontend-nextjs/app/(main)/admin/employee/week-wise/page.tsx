"use client";
import React, { useState } from "react";
import EmployeeTable from "@/components/EmployeeTable/EmployeeTable";
import { WEEK_WISE_COLUMN_CONFIG } from "@/types/columnConfig";
import { useEmployeeModal } from "@/hooks/useEmployeeModal";
import AddNewDataButton from "@/components/AddNewDataButton/AddNewDataButton";

import dynamic from "next/dynamic";

// Dynamically import the ModalForm component to reduce the initial bundle size
const ModalForm = dynamic(() => import("@/components/ModalForm/ModalForm"), {
  ssr: false,
});

const WeekWisePage = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  
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

  const handleRefresh = () => {
    // Trigger refresh from the hook instead of local state
    refreshEmployees();
  };

  return (
    <div>
      <div className="flex flex-row flex-wrap justify-between items-center mt-6 mb-4 px-4 gap-2 sm:gap-4">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 whitespace-nowrap">
          Week-wise Employee View
        </h2>

        {/* Button Section */}
        <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-3">
          {/* Total Count Button */}
          <button
            disabled
            className="box-border border-2 border-gray-300 px-3 sm:px-4 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm cursor-default hover:bg-gray-100 hover:shadow-sm transition duration-200 font-semibold text-gray-400"
          >
            Total Count: {employeeCount}
          </button>

          {/* Add New Data Button */}
          <AddNewDataButton onClick={openModalForAdd} />

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-semibold transition duration-200"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Modal Form for adding/editing employees */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={closeModal}
        refreshEmployees={refreshEmployees}
        employeeData={employeeData}
      />

      {/* Week-wise Table */}
      <EmployeeTable
        refreshFlag={refreshFlag}
        handleEdit={openModalForEdit}
        setEmployeeCount={setEmployeeCount}
        columnConfig={WEEK_WISE_COLUMN_CONFIG}
      />
    </div>
  );
};

export default WeekWisePage; 