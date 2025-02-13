"use client";
import React, { useState } from "react";
import AddNewDataButton from "@/components/AddNewDataButton/AddNewDataButton";
import EmployeeTable from "@/components/EmployeeTable/EmployeeTable";
import { EmployeeListItem } from "@/types/types";

import dynamic from "next/dynamic";

// Dynamically import the ModalForm component to reduce the initial bundle size
const ModalForm = dynamic(() => import("@/components/ModalForm/ModalForm"),{
  ssr: false,
  }
);

const EmployeePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [employeeData, setEmployeeData] = useState<EmployeeListItem | null>(
    null
  );

  // Open and close handlers for the modal
  const handleAddNewDataClick = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEmployeeData(null);
  };

  const refreshEmployees = () => {
    setRefreshFlag(!refreshFlag);
    if (employeeData) {
      setEmployeeData(null);
      setIsModalOpen(false);
    }
  };

  const handleEdit = (employeeData: EmployeeListItem) => {
    setEmployeeData(employeeData);
    setIsModalOpen(true);
    // console.log("employeeData", employeeData);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (
    <div>
      {/* Header section with Add New Data button */}
      <div className="flex justify-between items-center p-4">
        <AddNewDataButton onClick={handleAddNewDataClick} />
      </div>

      {/* Modal Form for adding new data */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        refreshEmployees={refreshEmployees}
        employeeData={employeeData}
      />

      {/* Table section */}
        <EmployeeTable refreshFlag={refreshFlag} handleEdit={handleEdit} />
    </div>
  );
};

export default EmployeePage;
