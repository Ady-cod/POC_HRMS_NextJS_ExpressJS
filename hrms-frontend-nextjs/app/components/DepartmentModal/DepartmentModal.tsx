"use client";

import "../ModalForm/ModalForm.css";
import { useState, useEffect, useMemo } from "react";
import { ZodError } from "zod";
import { createDepartmentSchema, updateDepartmentSchema } from "@/schemas/departmentSchema";
import { formatZodErrors } from "@/utils/formatZodErrors";
import { showToast } from "@/utils/toastHelper";
import { createDepartment, updateDepartment } from "@/actions/department";
import { DepartmentListItem, EmployeeListItem } from "@/types/types";
import HeadOfDepartmentModal from "../HeadOfDepartmentModal.tsx/HeadOfDepartmentModal";
import { ICONS } from "../DepartmentIcons/DepartmentIcons";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

type ConfirmationType = "HEAD_ELSEWHERE" | "MEMBER_ELSEWHERE";

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  refreshDepartments: () => void;
  departmentData: DepartmentListItem | null;
  employeeData: EmployeeListItem[];
  departments: DepartmentListItem[];
}

const DepartmentModal: React.FC<DepartmentModalProps> = ({
  isOpen,
  onClose,
  refreshDepartments,
  departmentData,
  employeeData,
  departments,
}) => {
  const [errors, setErrors] = useState<Record<string, string> | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [headOfDep, setHeadOfDep] = useState("");
  const [icon, setIcon] = useState(""); // store as "icon-1", etc.
  const [isHeadModalOpen, setIsHeadModalOpen] = useState(false);
  const [confirmationState, setConfirmationState] = useState<{
    type: ConfirmationType;
    employee: EmployeeListItem;
    previousDepartmentName: string | null;
    previousHeadDepartmentName: string | null;
  } | null>(null);

  const currentDepartmentId = departmentData?.id ?? null;

  const currentDepartmentName = useMemo(() => {
    return name.trim() || departmentData?.name || "this department";
  }, [name, departmentData?.name]);

  // Initialize form values
  useEffect(() => {
    if (departmentData) {
      setName(departmentData.name);
      setDescription(departmentData.description ?? "");
      setHeadOfDep(departmentData.deptHeadEmployeeId ?? "");
      setIcon(departmentData.icon ?? "");
    } else {
      setName("");
      setDescription("");
      setHeadOfDep("");
      setIcon("");
    }
  }, [departmentData]);

  const handleClose = () => {
    onClose();
    setErrors(null);
    setName("");
    setDescription("");
    setHeadOfDep("");
    setIcon("");
    setConfirmationState(null);
  };

  const applyHeadSelection = (employee: EmployeeListItem) => {
    setHeadOfDep(employee.id);
    setConfirmationState(null);
    setIsHeadModalOpen(false);
  };

  const handleHeadSelection = (employeeId: string) => {
    const selectedEmployee = employeeData.find((emp) => emp.id === employeeId);
    if (!selectedEmployee) {
      setIsHeadModalOpen(false);
      return;
    }

    const employeeDeptId = selectedEmployee.department?.id ?? null;
    const headDepartment = departments.find(
      (dept) => dept.deptHeadEmployeeId === selectedEmployee.id
    );
    const headDepartmentId = headDepartment?.id ?? null;

    const employeeIsHeadOfCurrentDept =
      currentDepartmentId !== null && headDepartmentId === currentDepartmentId;

    if (employeeIsHeadOfCurrentDept) {
      applyHeadSelection(selectedEmployee);
      return;
    }

    const belongsToDifferentDepartment =
      employeeDeptId !== null && employeeDeptId !== currentDepartmentId;

    if (headDepartment && headDepartmentId !== currentDepartmentId) {
      setIsHeadModalOpen(false);
      setConfirmationState({
        type: "HEAD_ELSEWHERE",
        employee: selectedEmployee,
        previousDepartmentName: selectedEmployee.department?.name ?? null,
        previousHeadDepartmentName: headDepartment.name,
      });
      return;
    }

    if (belongsToDifferentDepartment) {
      setIsHeadModalOpen(false);
      setConfirmationState({
        type: "MEMBER_ELSEWHERE",
        employee: selectedEmployee,
        previousDepartmentName: selectedEmployee.department?.name ?? null,
        previousHeadDepartmentName: headDepartment?.name ?? null,
      });
      return;
    }

    applyHeadSelection(selectedEmployee);
  };

  const handleConfirmationCancel = () => {
    setConfirmationState(null);
    setIsHeadModalOpen(true);
  };

  const handleConfirmationConfirm = () => {
    if (!confirmationState) return;
    applyHeadSelection(confirmationState.employee);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const departmentInputData = { name, description, headOfDep, icon };
      let response;

      if (departmentData) {
        // Updating department
        const filteredData: Partial<typeof departmentInputData> = {};
        (Object.keys(departmentInputData) as Array<keyof typeof departmentInputData>).forEach((key) => {
          const value = departmentInputData[key];
          const originalValue =
            key === "headOfDep"
              ? departmentData?.deptHeadEmployeeId ?? ""
              : key === "icon"
              ? departmentData?.icon ?? ""
              : departmentData?.[key as keyof DepartmentListItem] ?? "";

          if (value !== "" && value !== originalValue && value !== null && value !== undefined) {
            filteredData[key] = value;
          }
        });

        if (Object.keys(filteredData).length === 0) {
          showToast("error", "No changes made", ["Please change at least one field."]);
          return;
        }

        const validatedData = await updateDepartmentSchema.parseAsync(filteredData);
        response = await updateDepartment(departmentData.id, validatedData);
      } else {
        // Creating department
        const validatedData = await createDepartmentSchema.parseAsync(departmentInputData);
        response = await createDepartment(validatedData);
      }

      if (!response.success) {
        if (response.zodError) {
          throw new ZodError(response.zodError.issues);
        } else {
          const message =
            typeof response.message === "string" ? response.message : JSON.stringify(response.message);
          throw new Error(message);
        }
      }

      setErrors(null);
      showToast(
        "success",
        "Success!",
        [`Department "${departmentInputData.name}" ${departmentData ? "updated" : "created"} successfully!`]
      );
      refreshDepartments();
      handleClose();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodErrors(error);
        setErrors(formattedErrors);
        const messages = error.issues.map((i) => i.message);
        showToast("error", "Validation Error(s):", messages);
      } else if (error instanceof Error) {
        setErrors(null);
        showToast("error", "Error:", [error.message]);
      } else {
        setErrors(null);
        showToast("error", "Error:", ["Unknown error occurred."]);
      }
    }
  };

  const getHeadDisplayName = () => {
    if (!headOfDep) return "Select Head of Department";
    const employee = employeeData.find((e) => e.id === headOfDep);
    return employee ? employee.fullName : "Select Head of Department";
  };

  const confirmationDescription = useMemo(() => {
    if (!confirmationState) return "";

    const employeeName = confirmationState.employee.fullName;
    const previousDepartmentName =
      confirmationState.previousDepartmentName ?? "their current department";
    const previousHeadDepartmentName = confirmationState.previousHeadDepartmentName;

    if (confirmationState.type === "HEAD_ELSEWHERE") {
      const headDepartmentName = previousHeadDepartmentName || previousDepartmentName;
      return `${employeeName} is currently Head of ${headDepartmentName}. If you proceed, they will become Head of ${currentDepartmentName} and will be removed as Head from ${headDepartmentName}. Continue?`;
    }

    const descriptionParts = [
      `${employeeName} currently belongs to ${previousDepartmentName}. Setting them as Head of ${currentDepartmentName} will move their membership to ${currentDepartmentName}.`,
    ];

    if (
      previousHeadDepartmentName &&
      previousHeadDepartmentName !== previousDepartmentName
    ) {
      descriptionParts.push(
        `${employeeName} previously served as Head of ${previousHeadDepartmentName}.`
      );
    }

    descriptionParts.push("Continue?");

    return descriptionParts.join(" ");
  }, [confirmationState, currentDepartmentName]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-[952px] w-full p-6">
        <button className="modal-close" onClick={handleClose}>×</button>
        <h3 className="section-title mb-4">{departmentData ? "Edit" : "Create"} Department</h3>

        <form onSubmit={handleSubmit} className="modal-form flex flex-col gap-4">
          {/* Department Name */}
          <div className={`input-group flex flex-col ${errors?.name ? "hasErrors" : ""}`}>
            <label className="text-sm font-medium text-darkblue-900">Department Name</label>
            <input
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
            {errors?.name && <p className="error-message">{errors.name}</p>}
          </div>

          {/* Head of Department */}
          <div className="input-group flex flex-col">
            <label className="text-sm font-medium text-darkblue-900">Head of Department</label>
            <button
              type="button"
              className={`input-field cursor-pointer text-left ${!headOfDep ? "text-darkblue-200" : ""}`}
              onClick={() => setIsHeadModalOpen(true)}
            >
              {getHeadDisplayName()}
            </button>
            <input type="hidden" name="headOfDep" value={headOfDep} />
            {errors?.headOfDep && <p className="error-message">{errors.headOfDep}</p>}
          </div>

          <HeadOfDepartmentModal
            isOpen={isHeadModalOpen}
            onClose={() => setIsHeadModalOpen(false)}
            employees={employeeData}
            onSelect={handleHeadSelection}
          />

          {/* Description */}
          <div className={`input-group flex flex-col ${errors?.description ? "hasErrors" : ""}`}>
            <label className="text-sm font-medium text-darkblue-900">Department Description (max: 100 characters)</label>
            <textarea
              name="description"
              value={description}
              required
              maxLength={100}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field resize-none"
            />
            {errors?.description && <p className="error-message">{errors.description}</p>}
          </div>

          {/* Icon Selection */}
          <div>
            <label className="text-sm font-medium text-darkblue-900">Select Icon</label>
            <div className={`input-group flex flex-col overflow-x-auto mt-2.5 ${errors?.icon ? "hasErrors" : ""}`}>
              <div className="flex gap-4">
                {ICONS.map((IconComponent, index) => {
                  const iconValue = `icon-${index + 1}`;
                  const isSelected = icon === iconValue;
                  return (
                    <button
                      key={iconValue}
                      type="button"
                      className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2 transition transform hover:scale-105 ${
                        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
                      }`}
                      onClick={() => setIcon(iconValue)}
                    >
                      <IconComponent className={`w-8 h-8 ${isSelected ? "text-blue-500" : "text-gray-500"}`} />
                      <span className="text-xs text-gray-600">Icon {index + 1}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {errors?.icon && <p className="error-message">{errors.icon}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button type="submit" className="primary-button">
              {departmentData ? "Update Department" : "Create Department"}
            </button>
          </div>
        </form>
      </div>

      <ConfirmationModal
        isOpen={Boolean(confirmationState)}
        onClose={handleConfirmationCancel}
        onConfirm={handleConfirmationConfirm}
        title={
          confirmationState?.type === "HEAD_ELSEWHERE"
            ? "Move current Head of Department?"
            : "Move employee to new department?"
        }
        description={confirmationDescription}
      />
    </div>
  );
};

export default DepartmentModal;