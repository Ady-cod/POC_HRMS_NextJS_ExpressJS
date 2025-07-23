"use client";
import React, { useState } from "react";
import EmployeeTable from "@/components/EmployeeTable/EmployeeTable";
import { WEEK_WISE_COLUMN_CONFIG } from "@/types/columnConfig";
import { useEmployeeModal } from "@/hooks/useEmployeeModal";
import AddNewDataButton from "@/components/AddNewDataButton/AddNewDataButton";
import dynamic from "next/dynamic";

const ModalForm = dynamic(() => import("@/components/ModalForm/ModalForm"), {
  ssr: false,
});

const WeekWisePage = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [selectedWeek, setSelectedWeek] = useState(1);

  const {
    isModalOpen,
    employeeData,
    refreshFlag,
    openModalForAdd,
    openModalForEdit,
    closeModal,
    refreshEmployees,
  } = useEmployeeModal();

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-start gap-2 mt-6 mb-4 px-4">
        {/* Heading */}
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
          Week-wise Employee View
        </h2>

        {/* Button Group */}
        <div className="flex gap-2 sm:gap-3">
          <button
            disabled
            className="border-2 border-gray-300 px-4 py-1.5 rounded-md text-sm cursor-default hover:bg-gray-100 hover:shadow-sm transition font-semibold text-gray-400"
          >
            Total Count: {employeeCount}
          </button>

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

      {/* Employee Table */}
      <EmployeeTable
        refreshFlag={refreshFlag}
        handleEdit={openModalForEdit}
        setEmployeeCount={setEmployeeCount}
        columnConfig={WEEK_WISE_COLUMN_CONFIG}
        isWeekWise={true}
        selectedWeek={selectedWeek}
        setSelectedWeek={setSelectedWeek}
      />
    </div>
  );
};

export default WeekWisePage;
