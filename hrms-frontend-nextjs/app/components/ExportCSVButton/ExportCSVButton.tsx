import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { useCSVExport } from "@/hooks/useCSVExport";
import { EmployeeListItem } from "@/types/types";

interface ExportCSVButtonProps {
  employees: EmployeeListItem[];
  className?: string;
  buttonText?: string;
}

const ExportCSVButton: React.FC<ExportCSVButtonProps> = ({
  employees,
  className = "",
  buttonText = "Export to CSV",
}) => {
  const { exportToCSV } = useCSVExport();

  return (
    <button
      onClick={() => exportToCSV(employees)}
      className={`flex items-center gap-2 bg-gray-400 hover:opacity-90 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${className}`}
    >
      {buttonText}
      <FontAwesomeIcon icon={faDownload} />
    </button>
  );
};

export default ExportCSVButton; 