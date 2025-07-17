import { useState } from "react";
import { EmployeeListItem } from "@/types/types";

interface ModalState {
  isOpen: boolean;
  employeeData: EmployeeListItem | null;
}

export const useEmployeeModal = () => {
  // Consolidated modal state
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    employeeData: null,
  });

  const [refreshFlag, setRefreshFlag] = useState(false);

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

  return {
    // Modal state
    isModalOpen: modalState.isOpen,
    employeeData: modalState.employeeData,
    refreshFlag,
    
    // Modal actions
    openModalForAdd,
    openModalForEdit,
    closeModal,
    refreshEmployees,
  };
}; 