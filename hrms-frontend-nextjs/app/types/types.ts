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

// Define Employee gender enum
export enum EmployeeGender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

// Define EmployeeListItem interface
export interface EmployeeListItem {
  id: string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  country: string;
  city: string;
  streetAddress?: string | null;
  birthDate: string;
  dateOfJoining: string;
  department: DepartmentListItem | null;
  gender: EmployeeGender;
  role: EmployeeRole;
  status: EmployeeStatus;
  inductionCompleted?: boolean | null;
  profilePhotoUrl?: string | null;
  timezone?: string | null;
}
