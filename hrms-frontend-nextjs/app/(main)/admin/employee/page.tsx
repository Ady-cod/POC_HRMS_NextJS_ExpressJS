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
      <div className="flex justify-between items-center mt-6 mb-4 px-4">
        <h2 className="text-3xl font-bold text-gray-900">List</h2>
        <div className="flex items-center gap-4">
          <button
            disabled
            className="bg-transparent text-gray-800 px-4 py-2 rounded-md text-sm cursor-default border border-gray-300 hover:bg-gray-100 hover:shadow-sm transition duration-200"
          >
            Total Count: {employeeCount}
          </button>

          {/* Add Button */}
          <AddNewDataButton onClick={handleAddNewDataClick} />
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
