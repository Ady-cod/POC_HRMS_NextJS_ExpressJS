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
  buttonText = "Export it into CSV file",
}) => {
  const { exportToCSV } = useCSVExport();

  return (
    <button
      onClick={() => exportToCSV(employees)}
      className={`
        inline-flex items-center
        bg-[#008ec7]
        text-white
        rounded-lg 
        px-5 py-2          
        text-sm font-semibold
        shadow-sm
        hover:bg-[#0c3e66]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008ec7]
        focus-visible:ring-offset-2 focus-visible:ring-offset-white
        transition-colors duration-150 motion-reduce:transition-none
        ${className}
        `}
    >
      {/* text  */}
      <span className="pr-4">{buttonText}</span>

      {/* vertical divider (the thin line before the icon) */}
      <span className="h-5 w-0.5 bg-white/80" />

      {/* download icon */}
      <FontAwesomeIcon icon={faDownload} className="pl-4 text-base" />
    </button>
  );
};

export default ExportCSVButton; 