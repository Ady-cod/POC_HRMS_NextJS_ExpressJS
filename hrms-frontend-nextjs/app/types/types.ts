// Define EmployeeRole enum
export enum EmployeeRole {
  EMPLOYEE = "EMPLOYEE",
  INTERN = "INTERN",
  HR_INTERN = "HR_INTERN",
  HR_EMPLOYEE = "HR_EMPLOYEE",
  HR_MANAGER = "HR_MANAGER",
  MANAGER = "MANAGER",
  ADMIN = "ADMIN",
}

// Define EmployeeStatus enum
export enum EmployeeStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ON_LEAVE = "ON_LEAVE",
}

// Define Department interface
export interface DepartmentListItem {
  id: number;
  name: string;
}

// Define EmployeeListItem interface
export interface EmployeeListItem {
  id: number;
  firstName: string;
  lastName?: string | null;
  email: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  inductionCompleted?: boolean | null;
  phoneNumber?: string | null;
  profilePhotoUrl?: string | null;
  timezone?: string | null;
  department?: DepartmentListItem | null;
}
