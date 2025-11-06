"use client";

import React, { useState, useEffect } from "react";
import DepartmentCard from "@/components/DepartmentCard/DepartmentCard";
import AddNewDataButton from "@/components/AddNewDataButton/AddNewDataButton";
import TotalCountButton from "@/components/TotalCountButton/TotalCountButton";
import { useDepartmentModal } from "@/hooks/useDepartmentModal";
import { useDepartmentData } from "@/hooks/useDepartmentData";
import dynamic from "next/dynamic";
import { EmployeeListItem } from "@/types/types";
import { getAllEmployees } from "@/actions/employee";

const DepartmentModal = dynamic(() => import("@/components/DepartmentModal/DepartmentModal"), {
  ssr: false,
});

const DepartmentsPage = () => {
  const [departmentCount, setDepartmentCount] = useState(0);
  const [employees, setEmployees] = useState<EmployeeListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal hook for add/edit
  const {
    isModalOpen,
    departmentData,
    refreshFlag,
    openModalForAdd,
    openModalForEdit,
    closeModal,
    refreshDepartments,
  } = useDepartmentModal();

  // Data hook for departments and delete logic
  const {
    departments,
    selectedDepartment,
    handleDeleteClick,
    showDialog,
    confirmDelete,
    closeDeleteDialog,
  } = useDepartmentData({ refreshFlag, setDepartmentCount });

  // Fetch employees
  useEffect(() => {
    async function fetchEmployees() {
      const allEmployees = await getAllEmployees();
      setEmployees(allEmployees);
    }
    fetchEmployees();
  }, [refreshFlag]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 200); 

    return () => clearTimeout(timer);
  }, [refreshFlag]);

  return (
    <div className="w-full mb-4">
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-start gap-2 mt-6 mb-12 px-4 pr-[68px]">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-darkblue-900">
          Departments
        </h2>
        <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-3">
          <TotalCountButton count={departmentCount} />
          <AddNewDataButton onClick={openModalForAdd} />
        </div>
      </div>

      {/* Department Cards */}
      <DepartmentCard
        departments={departments}
        employees={employees}
        onEdit={openModalForEdit}
        selectedDepartment={selectedDepartment}
        handleDeleteClick={handleDeleteClick}
        showDialog={showDialog}
        confirmDelete={confirmDelete}
        closeDeleteDialog={closeDeleteDialog}
        isLoading={isLoading}
      />

      {/* Add/Edit Modal */}
      <DepartmentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        refreshDepartments={refreshDepartments}
        departmentData={departmentData}
        employeeData={employees}
      />
    </div>
  );
};

export default DepartmentsPage;