"use client";

import { useState } from "react";
import { EmployeeListItem } from "@/types/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  employees: EmployeeListItem[];
  onSelect: (employeeId: string) => void;
}

const HeadOfDepartmentModal: React.FC<Props> = ({ isOpen, onClose, employees, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  // Sort employees by first name
  const sortedEmployees = [...employees].sort((a, b) => {
    const firstNameA = a.fullName.split(" ")[0].toLowerCase();
    const firstNameB = b.fullName.split(" ")[0].toLowerCase();
    return firstNameA.localeCompare(firstNameB);
  });

  const filteredEmployees = sortedEmployees.filter(
    (emp) =>
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(" ");
    if (names.length === 1) return names[0][0]?.toUpperCase() ?? "";
    return (
      (names[0][0]?.toUpperCase() ?? "") +
      (names[names.length - 1][0]?.toUpperCase() ?? "")
    );
  };

  const highlightMatch = (text: string, query: string) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, idx) =>
    regex.test(part) ? (
      <span key={idx} className="text-orange-500 font-bold">
        {part}
      </span>
    ) : (
      part
    )
  );
};

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-xl w-full p-6 flex flex-col md:h-[80vh]">
        {/* Close button */}
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        {/* Header */}
        <h3 className="section-title mb-4">Select Head of Department</h3>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by name or email"
          className="input-field mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Employee List */}
        <div className="flex flex-col overflow-y-auto flex-1 gap-3 pr-3 scrollbar-thin">
          {filteredEmployees.length === 0 && (
            <p className="text-gray-500">No employees found.</p>
          )}

          {filteredEmployees.reduce<JSX.Element[]>((acc, emp, index) => {
            const firstLetter = emp.fullName[0].toUpperCase();
            const prevLetter =
              index > 0 ? filteredEmployees[index - 1].fullName[0].toUpperCase() : null;

            // Add a sticky letter heading if it's the first occurrence
            if (index === 0 || firstLetter !== prevLetter) {
              acc.push(
                <div
                  key={`letter-${firstLetter}`}
                  className="sticky top-0 bg-darkblue-75 z-10 text-sm font-bold text-darkblue-700 py-2 px-1"
                >
                  {firstLetter}
                </div>
              );
            }

            // Add employee card
            acc.push(
              <div
                key={emp.id}
                className="group flex items-start gap-4 p-3 border rounded-lg bg-white hover:bg-darkblue-700 text-darkblue-400 hover:text-darkblue-25 cursor-pointer break-words transition"
                onClick={() => onSelect(emp.id)}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center border border-lightblue-500 text-darkblue-700 text-md font-bold transition">
                  {getInitials(emp.fullName)}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <p className="text-sm">
                    Name:{" "}
                    <span className="text-base text-darkblue-700 group-hover:text-darkblue-25">
                      {highlightMatch(emp.fullName, searchTerm)}
                    </span>
                  </p>
                  <p className="text-sm">
                    Email:{" "}
                    <span className="text-base text-darkblue-700 group-hover:text-darkblue-25">
                      {highlightMatch(emp.email, searchTerm)}
                    </span>
                  </p>
                  <p className="text-sm">
                    Department:{" "}
                    <span className="text-base text-darkblue-700 group-hover:text-darkblue-25">
                      {emp.department?.name ?? "No Department"}
                    </span>
                  </p>
                </div>
              </div>
            );

            return acc;
          }, [])}
        </div>
      </div>
    </div>
  );
};

export default HeadOfDepartmentModal;