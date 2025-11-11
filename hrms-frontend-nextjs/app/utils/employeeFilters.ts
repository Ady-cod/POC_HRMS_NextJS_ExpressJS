import { EmployeeListItem, EmployeeStatus } from "@/types/types";

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

export const getInitialFilterState = (): FilterState => ({
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

export const checkIfFiltersActive = (filterState: FilterState): boolean => {
  const statusIsDefaultActive = filterState.selectedStatus === EmployeeStatus.ACTIVE;
  return !!(
    filterState.searchCategory ||
    filterState.searchText ||
    filterState.selectedRole ||
    filterState.selectedDepartment ||
    filterState.selectedStartDate ||
    filterState.selectedEndDate ||
    filterState.selectedStartDOB ||
    filterState.selectedEndDOB ||
    (filterState.selectedStatus && !statusIsDefaultActive)
  );
};

export const filterEmployeesByWeek = (
  employees: EmployeeListItem[],
  selectedWeek: number
): EmployeeListItem[] => {
  if (!selectedWeek) return employees;

  const today = new Date();
  const startOfWeek = new Date();
  startOfWeek.setDate(today.getDate() - 7 * (selectedWeek - 1));

  const endOfWeek = new Date();
  endOfWeek.setDate(today.getDate() - 7 * selectedWeek);

  return employees.filter((emp) => {
    if (!emp.dateOfJoining) return false;
    const doj = new Date(emp.dateOfJoining);
    if (selectedWeek === 17) {
      return doj <= endOfWeek;
    }
    return doj > endOfWeek && doj <= startOfWeek;
  });
};

export const filterEmployeesBySearch = (
  employees: EmployeeListItem[],
  filterState: FilterState
): EmployeeListItem[] => {
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

  return employees.filter((emp) => {
    if (selectedStatus && emp.status !== selectedStatus) return false;
    
    let value = "";

    switch (searchCategory) {
      case "name":
        value = emp.fullName || "";
        return value.toLowerCase().includes(lowerSearch);
      case "email":
        value = emp.email || "";
        return value.toLowerCase().includes(lowerSearch);
      case "role":
        return selectedRole ? emp.role === selectedRole : true;
      case "department":
        return selectedDepartment ? emp.department?.name === selectedDepartment : true;
      
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
};

export const applyAllFilters = (
  employees: EmployeeListItem[],
  filterState: FilterState,
  selectedWeek?: number,
  isWeekWise: boolean = false
): EmployeeListItem[] => {
  let filtered = employees;

  // Apply week filter first if enabled
  if (isWeekWise && selectedWeek) {
    filtered = filterEmployeesByWeek(filtered, selectedWeek);
  }

  // Apply search filters
  filtered = filterEmployeesBySearch(filtered, filterState);

  return filtered;
};