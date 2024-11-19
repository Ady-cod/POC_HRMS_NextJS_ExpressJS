<<<<<<< HEAD
"use client";
import React, { useState } from "react";
import AddNewDataButton from "@/components/addbutton/AddNewDataButton";
import ModalForm from "@/components/addbutton/ModalForm";
import EmployeeTable from "@/components/EmployeeTable/EmployeeTable";

const EmployeeListPage = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedData, setsubmittedData] = useState(null);

  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };
  // Open and close handlers for the modal
  const handleAddNewDataClick = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
=======
"use client"
import React,{useState} from 'react';
import AddNewDataButton from '../../components/AddButtons/AddNewDataButton';
import ModalForm from '../../components/AddButtons/ModalForm';
import EmployeeTable from '../../components/EmployeeTables/EmployeeTable';

const EmployeePage=()=>{
    const [isSideBarOpen,setIsSideBarOpen] = useState<boolean>(true)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submittedData,setsubmittedData] = useState(null)

    const toggleSideBar=()=>{
    setIsSideBarOpen(!isSideBarOpen)
    }
     // Open and close handlers for the modal
     const handleAddNewDataClick = () => {
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
>>>>>>> 64e08e0b4ddc404f21eaccbb420140876f5da89d

  const handleFormData = (data: any) => {
    setsubmittedData(data);
  };

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
        onSubmit={handleFormData}
      />

<<<<<<< HEAD
      {/* Other content like your table goes here */}
=======
            {/* Modal Form for adding new data */}
            <ModalForm isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleFormData} />
            
            {/* Other content like your table goes here */}
            
                <EmployeeTable />
            
            
        
>>>>>>> 64e08e0b4ddc404f21eaccbb420140876f5da89d

      <EmployeeTable />
    </div>
  );
};

<<<<<<< HEAD
export default EmployeeListPage;
=======
export default EmployeePage;
>>>>>>> 64e08e0b4ddc404f21eaccbb420140876f5da89d
