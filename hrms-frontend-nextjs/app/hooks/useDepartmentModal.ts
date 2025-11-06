import { useState } from "react";
import { DepartmentListItem } from "@/types/types";

interface ModalState {
  isOpen: boolean;
  departmentData: DepartmentListItem | null;
}

export const useDepartmentModal = () => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    departmentData: null,
  });

  const [refreshFlag, setRefreshFlag] = useState(false);

  const openModalForAdd = () => {
    setModalState({ isOpen: true, departmentData: null });
  };

  const openModalForEdit = (departmentData: DepartmentListItem) => {
    setModalState({ isOpen: true, departmentData });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, departmentData: null });
  };

  const refreshDepartments = () => {
    setRefreshFlag(!refreshFlag);
    closeModal();
  };

  return {
    isModalOpen: modalState.isOpen,
    departmentData: modalState.departmentData,
    refreshFlag,
    openModalForAdd,
    openModalForEdit,
    closeModal,
    refreshDepartments,
  };
};