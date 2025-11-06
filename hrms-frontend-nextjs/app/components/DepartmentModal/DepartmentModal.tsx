"use client";

import "../ModalForm/ModalForm.css";
import { useState, useEffect } from "react";
import { ZodError } from "zod";
import { createDepartmentSchema, updateDepartmentSchema } from "@/schemas/departmentSchema";
import { formatZodErrors } from "@/utils/formatZodErrors";
import { showToast } from "@/utils/toastHelper";
import { createDepartment, updateDepartment } from "@/actions/department";
import { DepartmentListItem, EmployeeListItem } from "@/types/types";
import HeadOfDepartmentModal from "../HeadOfDepartmentModal.tsx/HeadOfDepartmentModal";
import { ICONS } from "../DepartmentIcons/DepartmentIcons";

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  refreshDepartments: () => void;
  departmentData: DepartmentListItem | null;
  employeeData: EmployeeListItem[];
}

const DepartmentModal: React.FC<DepartmentModalProps> = ({
  isOpen,
  onClose,
  refreshDepartments,
  departmentData,
  employeeData,
}) => {
  const [errors, setErrors] = useState<Record<string, string> | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [headOfDep, setHeadOfDep] = useState("");
  const [icon, setIcon] = useState(""); // store as "icon-1", etc.
  const [isHeadModalOpen, setIsHeadModalOpen] = useState(false);

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
            onSelect={(employeeId: string) => {
              setHeadOfDep(employeeId);
              setIsHeadModalOpen(false);
            }}
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
              <div className="icon-grid flex gap-2 overflow-x-auto p-2 bg-white rounded-sm">
                {ICONS.map((IconComponent, index) => {
                  const iconId = `icon-${index + 1}`;
                  const isSelected = icon === iconId;
                  return (
                    <div key={iconId} className="relative">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="absolute top-1 right-1 w-3 h-3 accent-lightblue-500"
                      />
                      <button
                        type="button"
                        className={`icon-button p-3 pb-2 pt-6 rounded transition-colors duration-200 ${
                          isSelected ? "border border-darkblue-75" : ""
                        }`}
                        onClick={() => setIcon(iconId)}
                      >
                        <IconComponent className="w-12 h-12" />
                      </button>
                    </div>
                  );
                })}
              </div>
              {errors?.icon && <p className="error-message">{errors.icon}</p>}
            </div>
          </div>

          <div className="submit-button-container">
            <button type="submit" className="submit-button mt-2">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentModal;