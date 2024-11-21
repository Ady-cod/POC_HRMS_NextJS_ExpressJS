import { Gender, Role, Status } from "@prisma/client";
import { z } from "zod";
import { isValid, parseISO } from "date-fns";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// Helper function to check if a string is a valid phone number
const isValidPhoneNumber = (phoneNumber: string | null): boolean => {
  if (!phoneNumber) return true; // Allow null (optional field)
  const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber);
  return parsedPhoneNumber?.isValid() || false;
};

// Helper function to check if a string is a valid date
const isValidDate = (dateString: string | null): boolean => {
  if (!dateString) return true; // Allow null (optional field)
  const parsedDate = parseISO(dateString);
  return (
    isValid(parsedDate) && dateString.match(/^\d{4}-\d{2}-\d{2}$/) !== null
  ); // Ensures it's a valid ISO date
};

// Zod schema for employee creation
export const createEmployeeSchema = z.object({
  fullName: z.string().min(1, "Employee name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z
    .union([z.string(), z.null()])
    .refine(isValidPhoneNumber, {
      message: "Invalid phone number format",
    }) // Validate as a phone number
    .optional()
    .default(null)
    .transform((value) => (value === "" ? null : value)),
  country: z.string().min(2, "Country is required"),
  city: z.string().min(2, "City is required"),
  streetAddress: z
    .union([z.string(), z.null()])
    .optional()
    .default(null)
    .transform((value) => (value === "" ? null : value)),
  birthDate: z
    .union([z.string(), z.null()])
    .refine(isValidDate, {
      message: "Invalid birth date format, expected a valid YYYY-MM-DD",
    }) // Validate as a date format
    .optional()
    .default(null)
    .transform((date) => (date ? `${date}T00:00:00.000Z` : null)), // Appends time if date exists
  dateOfJoining: z
    .union([z.string(), z.null()])
    .refine(isValidDate, {
      message: "Invalid date of joining format, expected a valid YYYY-MM-DD",
    }) // Validate as a date format
    .optional()
    .default(null)
    .transform((date) => (date ? `${date}T00:00:00.000Z` : null)), // Appends time if date exists
  departmentName: z.string().min(1, "Department name is required"),
  gender: z.nativeEnum(Gender).optional().default(Gender.OTHER), // Based on radio buttons
  inductionCompleted: z.boolean().optional().default(false), // Default to false
  role: z.nativeEnum(Role).optional().default(Role.EMPLOYEE), // Default to EMPLOYEE
  status: z.nativeEnum(Status).optional().default(Status.ACTIVE), // Default to ACTIVE
});
