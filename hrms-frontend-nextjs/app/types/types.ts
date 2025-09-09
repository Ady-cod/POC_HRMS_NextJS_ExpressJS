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

// Centralized department names used across the app
export enum DepartmentName {
  HR = "HR",
  WEB_DEVELOPMENT = "Web Development",
  UI_UX = "UI/UX",
  QA = "QA",
  BA = "BA",
  SM = "SM",
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
  countryCode?: string | null; 
  state?: string | null;
  stateCode?: string | null;
  city: string;
  streetAddress?: string | null;
  birthDate: string;
  dateOfJoining: string;
  department: DepartmentListItem | null;
  role: EmployeeRole;
  status: EmployeeStatus;
  gender: EmployeeGender;
  inductionCompleted?: boolean | null;
  profilePhotoUrl?: string | null;
  timezone?: string | null;
}
