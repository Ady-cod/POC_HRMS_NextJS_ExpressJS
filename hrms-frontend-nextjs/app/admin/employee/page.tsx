"use client";
import React, { useState } from "react";
import AddNewDataButton from "../../components/AddNewDataButton/AddNewDataButton";
import ModalForm from "../../components/ModalForm/ModalForm";
import EmployeeTable from "../../components/EmployeeTable/EmployeeTable";

const EmployeePage = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);

  // Open and close handlers for the modal
  const handleAddNewDataClick = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const refreshEmployees = () => {
    setRefreshFlag(!refreshFlag);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (
    <div>
      {/* Header section with Add New Data button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
        }}
      >
        <AddNewDataButton onClick={handleAddNewDataClick} />
      </div>

      {/* Modal Form for adding new data */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        refreshEmployees={refreshEmployees}
      />

      {/* Other content like your table goes here */}

      <EmployeeTable refreshFlag={refreshFlag} />
    </div>
  );
};

export default EmployeePage;
