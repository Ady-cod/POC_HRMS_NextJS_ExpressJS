import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import { EmployeeListItem } from "@/types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import dynamic from "next/dynamic";
import EmployeeSearchFilters, {
  FilterState,
} from "@/components/EmployeeSearchFilters/EmployeeSearchFilters";
import { useCSVExport } from "@/hooks/useCSVExport";
import { useEmployeeTableColumns } from "@/hooks/useEmployeeTableColumns";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { ColumnConfig } from "@/types/columnConfig";
import WeekSlider from "@/components/WeekSlider/weekSlider";

const ConfirmationModal = dynamic(
  () => import("@/components/ConfirmationModal/ConfirmationModal"),
  { ssr: false }
);

interface EmployeeTableProps {
  refreshFlag: boolean;
  handleEdit: (employeeData: EmployeeListItem) => void;
  setEmployeeCount: (count: number) => void;
  columnConfig?: ColumnConfig;
  isWeekWise?: boolean;
  selectedWeek?: number;
  setSelectedWeek?: (week: number) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  refreshFlag,
  handleEdit,
  setEmployeeCount,
  columnConfig,
  isWeekWise = false,
  selectedWeek,
  setSelectedWeek,
}) => {
  const {
    employees,
    selectedEmployee,
    showDialog,
    handleDeleteClick,
    confirmDelete,
    closeDeleteDialog,
  } = useEmployeeData({ refreshFlag, setEmployeeCount });

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeColumnIndex, setActiveColumnIndex] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filterState, setFilterState] = useState<FilterState>({
    searchText: "",
    searchCategory: "",
    selectedRole: "",
    selectedDepartment: "",
    selectedStartDate: "",
    selectedEndDate: "",
    selectedStartDOB: "",
    selectedEndDOB: "",
    selectedStatus: "",
  });

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilterState((prev) => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilterState({
      searchText: "",
      searchCategory: "",
      selectedRole: "",
      selectedDepartment: "",
      selectedStartDate: "",
      selectedEndDate: "",
      selectedStartDOB: "",
      selectedEndDOB: "",
      selectedStatus: "",
    });
  };

  const { exportToCSV } = useCSVExport();

  useEffect(() => {
    setIsSmallScreen(window.innerWidth < 640);
    const handleResize = () => setIsSmallScreen(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { columns } = useEmployeeTableColumns({
    currentPage,
    rowsPerPage,
    handleEdit,
    handleDeleteClick,
    isSmallScreen,
    activeSectionIndex,
    activeColumnIndex,
    setActiveSectionIndex,
    setActiveColumnIndex,
    columnConfig,
  });

  const filteredEmployees = useMemo(() => {
    let filtered = employees;

    if (isWeekWise && selectedWeek) {
      const today = new Date();
      const startOfWeek = new Date();
      startOfWeek.setDate(today.getDate() - 7 * (selectedWeek - 1));

      const endOfWeek = new Date();
      endOfWeek.setDate(today.getDate() - 7 * selectedWeek);

      filtered = filtered.filter((emp) => {
        if (!emp.dateOfJoining) return false;
        const doj = new Date(emp.dateOfJoining);
        if (selectedWeek === 17) {
          return doj <= endOfWeek;
        }
        return doj > endOfWeek && doj <= startOfWeek;
      });
    }

    const {
      searchCategory,
      searchText,
      selectedRole,
      selectedDepartment,
      selectedStatus,
      selectedStartDate,
      selectedEndDate,
      selectedStartDOB,
      selectedEndDOB,
    } = filterState;

    const lowerSearch = searchText.toLowerCase();

    return filtered.filter((emp) => {
      let value = "";

      switch (searchCategory) {
        case "name":
          value = emp.fullName || "";
          return value.toLowerCase().includes(lowerSearch);
        case "email":
          value = emp.email || "";
          return value.toLowerCase().includes(lowerSearch);
        case "role":
          return emp.role === selectedRole;
        case "department":
          return emp.department?.name === selectedDepartment;
        case "status":
          return emp.status === selectedStatus;
        case "dateOfJoining":
          if (!emp.dateOfJoining) return false;
          const doj = new Date(emp.dateOfJoining).toISOString().split("T")[0];
          if (selectedStartDate && selectedEndDate) {
            return doj >= selectedStartDate && doj <= selectedEndDate;
          }
          if (selectedStartDate) return doj >= selectedStartDate;
          if (selectedEndDate) return doj <= selectedEndDate;
          return true;
        case "dateOfBirth":
          if (!emp.birthDate) return false;
          const dob = new Date(emp.birthDate).toISOString().split("T")[0];
          if (selectedStartDOB && selectedEndDOB) {
            return dob >= selectedStartDOB && dob <= selectedEndDOB;
          }
          if (selectedStartDOB) return dob >= selectedStartDOB;
          if (selectedEndDOB) return dob <= selectedEndDOB;
          return true;
        default:
          return true;
      }
    });
  }, [employees, filterState, selectedWeek, isWeekWise]);

  return (
    <div>
      <EmployeeSearchFilters
        filterState={filterState}
        updateFilter={updateFilter}
        clearAllFilters={clearAllFilters}
        employees={employees}
      />

      <div className="flex justify-start mb-4 px-3">
        <button
          onClick={() => exportToCSV(filteredEmployees)}
          className="flex items-center gap-2 bg-gray-400 hover:opacity-90 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
        >
          Export to CSV
          <FontAwesomeIcon icon={faDownload} />
        </button>
      </div>

      {isWeekWise && selectedWeek !== undefined && setSelectedWeek && (
        <WeekSlider
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
        />
      )}

      <DataTable
        fixedHeaderScrollHeight="calc(100vh - 130px - 60px)"
        columns={columns}
        data={filteredEmployees}
        pagination
        paginationPerPage={rowsPerPage}
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        onChangePage={setCurrentPage}
        onChangeRowsPerPage={setRowsPerPage}
        responsive
        fixedHeader
      />

      <ConfirmationModal
        isOpen={showDialog}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        description={`Are you sure you want to delete "${selectedEmployee?.fullName}"?`}
      />
    </div>
  );
};

export default EmployeeTable;
