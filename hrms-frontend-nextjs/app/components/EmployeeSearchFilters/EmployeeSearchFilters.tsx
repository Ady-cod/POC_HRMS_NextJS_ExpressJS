import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faSearch } from "@fortawesome/free-solid-svg-icons";
import { EmployeeListItem, EmployeeRole, EmployeeStatus } from "@/types/types";

export interface FilterState {
  searchText: string;
  searchCategory: string;
  selectedRole: string;
  selectedDepartment: string;
  selectedStartDate: string;
  selectedEndDate: string;
  selectedStartDOB: string;
  selectedEndDOB: string;
  selectedStatus: string;
}

interface EmployeeSearchFiltersProps {
  filterState: FilterState;
  updateFilter: (key: keyof FilterState, value: string) => void;
  clearAllFilters: () => void;
  employees: EmployeeListItem[];
}

const EmployeeSearchFilters: React.FC<EmployeeSearchFiltersProps> = ({
  filterState,
  updateFilter,
  clearAllFilters,
  employees,
}) => {
  // Check if any filters are active
  const hasActiveFilters = 
    filterState.searchCategory ||
    filterState.searchText ||
    filterState.selectedRole ||
    filterState.selectedDepartment ||
    filterState.selectedStartDate ||
    filterState.selectedEndDate ||
    filterState.selectedStartDOB ||
    filterState.selectedEndDOB ||
    filterState.selectedStatus;

  // Get unique departments from employees
  const uniqueDepartments = Array.from(
    new Set(
      employees
        .map((emp) => emp.department?.name)
        .filter((name): name is string => Boolean(name))
    )
  );

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-gray-100 rounded-md shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Category Dropdown */}
        <select
          value={filterState.searchCategory}
          onChange={(e) => updateFilter('searchCategory', e.target.value)}
          className="w-48 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
        >
          <option value="" disabled>
            Search By Category
          </option>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="dateOfJoining">Date of Joining</option>
          <option value="dateOfBirth">Date of Birth</option>
          <option value="role">Role</option>
          <option value="department">Department</option>
          <option value="status">Status</option>
        </select>

        {/* Conditional Inputs */}
        {filterState.searchCategory === "name" || filterState.searchCategory === "email" ? (
          <div className="relative w-60">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder={`Search by ${filterState.searchCategory
                .replace(/([A-Z])/g, " $1")
                .toLowerCase()
                .replace(/^./, (str: string) => str.toUpperCase())}...`}
              value={filterState.searchText}
              onChange={(e) => updateFilter('searchText', e.target.value)}
              className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ) : filterState.searchCategory === "role" ? (
          <select
            value={filterState.selectedRole}
            onChange={(e) => updateFilter('selectedRole', e.target.value)}
            className="w-60 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Roles</option>
            {Object.values(EmployeeRole).map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        ) : filterState.searchCategory === "department" ? (
          <select
            value={filterState.selectedDepartment}
            onChange={(e) => updateFilter('selectedDepartment', e.target.value)}
            className="w-60 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Departments</option>
            {uniqueDepartments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        ) : filterState.searchCategory === "dateOfJoining" ? (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filterState.selectedStartDate}
              onChange={(e) => updateFilter('selectedStartDate', e.target.value)}
              className="w-40 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-600 text-sm font-medium">to</span>
            <input
              type="date"
              value={filterState.selectedEndDate}
              onChange={(e) => updateFilter('selectedEndDate', e.target.value)}
              className="w-40 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ) : filterState.searchCategory === "dateOfBirth" ? (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filterState.selectedStartDOB}
              onChange={(e) => updateFilter('selectedStartDOB', e.target.value)}
              className="w-40 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-600 text-sm font-medium">to</span>
            <input
              type="date"
              value={filterState.selectedEndDOB}
              onChange={(e) => updateFilter('selectedEndDOB', e.target.value)}
              className="w-40 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ) : filterState.searchCategory === "status" ? (
          <select
            value={filterState.selectedStatus}
            onChange={(e) => updateFilter('selectedStatus', e.target.value as EmployeeStatus)}
            className="w-60 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Statuses</option>
            {Object.values(EmployeeStatus).map((status) => (
              <option key={status} value={status}>
                {status.replace(/_/g, " ").toUpperCase()}
              </option>
            ))}
          </select>
        ) : null}

        {/* Remove Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
          >
            <FontAwesomeIcon icon={faArrowsRotate} />
            Remove Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default EmployeeSearchFilters; 