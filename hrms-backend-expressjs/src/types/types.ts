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

// Define EmployeeGender enum
export enum
  EmployeeGender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

// Interface for creating a new employee. Define the structure of a request body for creating a new employee
export interface CreateEmployeeInput {
  fullName: string;
  email: string;
  password: string;
  country: string;
  countryCode?: string | null;
  state?: string | null;
  stateCode?: string | null;
  city: string;
  streetAddress?: string | null;
  phoneNumber: string;
  birthDate: string;
  dateOfJoining: string;
  gender: EmployeeGender;
  inductionCompleted?: boolean | null;
  profilePhotoUrl?: string | null;
  timezone?: string | null;
  role: EmployeeRole;
  status: EmployeeStatus;
  departmentName: string;
}

// Interface for the data object to be passed to Prisma for creating a new employee
export interface CreateEmployeePrismaData {
  fullName: string;
  email: string;
  password: string;
  country: string;
  countryCode?: string | null;
  state?: string | null;
  stateCode?: string | null;
  city: string;
  streetAddress?: string | null;
  phoneNumber: string;
  birthDate: string;
  dateOfJoining: string;
  gender: EmployeeGender;
  inductionCompleted?: boolean;
  profilePhotoUrl?: string | null;
  timezone?: string | null;
  role: EmployeeRole;
  status: EmployeeStatus;
  departmentId?: string | null;
}
