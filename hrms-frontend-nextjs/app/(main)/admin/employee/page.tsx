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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [employeeData, setEmployeeData] = useState<EmployeeListItem | null>(
    null
  );
  const [employeeCount, setEmployeeCount] = useState(0);

  // Open and close handlers for the modal
  const handleAddNewDataClick = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (employeeData) {
      setEmployeeData(null);
    }
  };

  const refreshEmployees = () => {
    setRefreshFlag(!refreshFlag);
    setIsModalOpen(false);
    if (employeeData) {
      setEmployeeData(null);
    }
  };

  const handleEdit = (employeeData: EmployeeListItem) => {
    setEmployeeData(employeeData);
    setIsModalOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            style={{ color: "#a7aeb4" }}
            className="box-border border-2 border-gray-300 px-3 sm:px-4 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm cursor-default hover:bg-gray-100 hover:shadow-sm transition duration-200 font-semibold"
          >
            Total Count: {employeeCount}
          </button>

          {/* Add New Data Button (wrapped to apply consistent responsive sizing) */}
          <div className="text-xs sm:text-sm px-0 sm:px-0 py-0 sm:py-0">
            <AddNewDataButton onClick={handleAddNewDataClick} />
          </div>
        </div>
      </div>

      {/* Modal Form for adding new data */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        refreshEmployees={refreshEmployees}
        employeeData={employeeData}
      />

      {/* Table section */}
      <EmployeeTable
        refreshFlag={refreshFlag}
        handleEdit={handleEdit}
        setEmployeeCount={setEmployeeCount}
      />
    </div>
  );
};

export default EmployeePage;
