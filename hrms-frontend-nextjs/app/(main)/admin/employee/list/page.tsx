"use client";
import React, { useState } from "react";
import AddNewDataButton from "@/components/AddNewDataButton/AddNewDataButton";
import EmployeeTable from "@/components/EmployeeTable/EmployeeTable";
import { EmployeeListItem } from "@/types/types";

import dynamic from "next/dynamic";

// Dynamically import the ModalForm component to reduce the initial bundle size
const ModalForm = dynamic(() => import("@/components/ModalForm/ModalForm"), {
  ssr: false,
});

const EmployeePage = () => {
  // Consolidated modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    employeeData: null as EmployeeListItem | null,
  });
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [employeeCount, setEmployeeCount] = useState(0);

  // Modal management functions
  const openModalForAdd = () => {
    setModalState({ isOpen: true, employeeData: null });
  };

  const openModalForEdit = (employeeData: EmployeeListItem) => {
    setModalState({ isOpen: true, employeeData });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, employeeData: null });
  };

  const refreshEmployees = () => {
    setRefreshFlag(!refreshFlag);
    closeModal();
  };

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
          <button
            disabled
            className="box-border border-2 border-gray-300 px-3 sm:px-4 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm cursor-default hover:bg-gray-100 hover:shadow-sm transition duration-200 font-semibold text-gray-400"
          >
            Total Count: {employeeCount}
          </button>

          {/* Add New Data Button */}
          <AddNewDataButton onClick={openModalForAdd} />
        </div>
      </div>

      {/* Modal Form for adding new data */}
      <ModalForm
        isOpen={modalState.isOpen}
        onClose={closeModal}
        refreshEmployees={refreshEmployees}
        employeeData={modalState.employeeData}
      />

      {/* Table section */}
      <EmployeeTable
        refreshFlag={refreshFlag}
        handleEdit={openModalForEdit}
        setEmployeeCount={setEmployeeCount}
      />
    </div>
  );
};

export default EmployeePage;
