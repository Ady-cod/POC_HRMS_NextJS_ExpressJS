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
  password?: string;
  country?: string;
  city?: string;
  streetAddress?: string;
  phoneNumber?: string;
  birthDate?: string;
  dateOfJoining?: string;
  gender?: EmployeeGender;
  inductionCompleted?: boolean;
  profilePhotoUrl?: string;
  timezone?: string;
  role?: EmployeeRole;
  status?: EmployeeStatus;
  departmentId?: string;
}

// Interface for the data object to be passed to Prisma for creating a new employee
export interface CreateEmployeePrismaData {
  fullName: string;
  email: string;
  password: string | null;
  country: string | null;
  city: string | null;
  streetAddress: string | null;
  phoneNumber: string | null;
  birthDate: string | null;
  dateOfJoining: string | null;
  gender: EmployeeGender | null;
  inductionCompleted: boolean;
  profilePhotoUrl: string | null;
  timezone: string | null;
  role: EmployeeRole;
  status: EmployeeStatus;
  departmentId: string | null;
}
