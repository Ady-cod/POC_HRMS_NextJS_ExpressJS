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

// Interface for creating a new employee. Define the structure of a request body for creating a new employee
export interface CreateEmployeeInput {
  firstName: string;
  lastName?: string;
  email: string;
  inductionCompleted?: boolean;
  phoneNumber?: string;
  profilePhotoUrl?: string;
  timezone?: string;
  role?: EmployeeRole;
  status?: EmployeeStatus;
  departmentId?: string;
}

// Interface for the data object to be passed to Prisma for creating a new employee
export interface CreateEmployeePrismaData {
  firstName: string;
  lastName: string | null;
  email: string;
  inductionCompleted: boolean;
  phoneNumber: string | null;
  profilePhotoUrl: string | null;
  timezone: string | null;
  role: EmployeeRole;
  status: EmployeeStatus;
  departmentId: string | null;
}
