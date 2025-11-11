"use client";

import React, { useState } from "react";
import ConfirmationModal from "@/components/ConfirmationModal/ConfirmationModal";
import { DepartmentListItem, EmployeeListItem } from "@/types/types";
import { ICONS } from "../DepartmentIcons/DepartmentIcons";

interface DepartmentCardProps {
  departments: DepartmentListItem[];
  employees: EmployeeListItem[];
  onEdit: (department: DepartmentListItem) => void;
  selectedDepartment: DepartmentListItem | null;
  showDialog: boolean;
  handleDeleteClick: (dep: DepartmentListItem) => void;
  confirmDelete: () => void;
  closeDeleteDialog: () => void;
  isLoading?: boolean;
}

export default function DepartmentCard({
  departments,
  employees,
  onEdit,
  selectedDepartment,
  showDialog,
  handleDeleteClick,
  confirmDelete,
  closeDeleteDialog,
  isLoading = false
}: DepartmentCardProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getHeadName = (dep: DepartmentListItem) => {
    if (!dep.deptHeadEmployeeId) return "N/A";
    const employee = employees.find((e) => e.id === dep.deptHeadEmployeeId);
    if (employee) return employee.fullName;

    // If employee is not yet loaded, show a spinner
    return (
      <div className="flex justify-center items-center text-gray-500 mt-2 w-full h-4">
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-gray-500 py-10">
        <div
          aria-hidden="true"
          className="w-10 h-10 border-4 border-current border-t-transparent rounded-full animate-spin"
        />
        <p className="mt-3 font-medium text-base">Loading departments…</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-8 px-4 md:px-10">
      {departments.map((dep) => {
        const iconIndex = dep.icon ? parseInt(dep.icon.replace("icon-", "")) - 1 : -1;
        const IconComponent = ICONS[iconIndex];

        return (
          <div
            key={dep.id}
            className="relative bg-white rounded-lg text-center transition-transform transform hover:scale-105 overflow-hidden border-b-8 border-darkblue-50 hover:border-none flex flex-col"
            onMouseEnter={() => setHoveredId(dep.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              boxShadow:
                "0 4px 6px -1px rgba(0,0,0,0.4), 4px 0 6px -1px rgba(0,0,0,0.05), -4px 0 6px -1px rgba(0,0,0,0.05)",
            }}
          >
            <div className="flex-1 flex flex-col justify-between p-4">
              <div>
                <div className="mt-2 mb-4 text-4xl flex justify-center">
                  {IconComponent ? <IconComponent className="w-12 h-12" /> : <span>🧩</span>}
                </div>
                <h2 className="text-xl font-semibold text-darkblue-900">{dep.name}</h2>
                <p className="text-darkblue-900 mb-2">{dep.description}</p>
                <p className="text-sm">Head of Department</p>
                <p className="font-semibold mb-2">{getHeadName(dep)}</p>
              </div>

              <div
                className={`absolute bottom-0 left-0 py-7 w-full bg-darkblue-50 flex flex-col gap-2 p-3 justify-center transform transition-all duration-300 ${
                  hoveredId === dep.id ? "translate-y-0" : "translate-y-full"
                }`}
              >
                <button
                  onClick={() => onEdit(dep)}
                  className="px-3 py-1 bg-lightblue-500 font-bold text-white rounded hover:bg-lightblue-700 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(dep)}
                  className="px-3 py-1 font-bold bg-white text-lightblue-500 rounded border-2 border-lightblue-500 hover:bg-darkblue-50 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}

      <ConfirmationModal
        isOpen={showDialog}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        description={`Are you sure you want to delete the department "${selectedDepartment?.name}"? This decision is irreversible.`}
      />
    </div>
  );
}