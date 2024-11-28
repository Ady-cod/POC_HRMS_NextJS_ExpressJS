import { z } from "zod";
import { isValid, parseISO } from "date-fns";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// Helper function to check if a string is a valid phone number
const isValidPhoneNumber = (phoneNumber: string): boolean => {
  if (!phoneNumber) return true; // Allow empty string (optional field)
  const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber);
  return parsedPhoneNumber?.isValid() || false;
};

// Helper function to check if a string is a valid date
const isValidDate = (dateString: string): boolean => {
  if (!dateString) return true; // Allow empty string (optional field)
  const parsedDate = parseISO(dateString);
  return (
    isValid(parsedDate) && dateString.match(/^\d{4}-\d{2}-\d{2}$/) !== null
  ); // Ensures it's a valid ISO date
};

// Zod schema for employee creation
export const createEmployeeSchema = z.object({
  fullName: z.string().min(3, "Employee name is required, min 3 characters"),
  email: z.string().email("Invalid email address, use the format email@example.com"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z
    .string()
    .refine(isValidPhoneNumber, {
      // Validate as a phone number
      message:
        "Invalid phone number format. Use international format (e.g., +123456789)",
    })
    .optional(),
  country: z.string().min(2, "Country is required, min 2 characters"),
  city: z.string().min(3, "City is required, min 3 characters"),
  streetAddress: z.string().optional(),
  birthDate: z
    .string()
    .refine(isValidDate, {
      message: "Invalid birth date format, expected a valid YYYY-MM-DD",
    }) // Validate as a date format
    .optional(),
  dateOfJoining: z
    .string()
    .refine(isValidDate, {
      message: "Invalid date of joining format, expected a valid YYYY-MM-DD",
    }) // Validate as a date format
    .optional(),
  departmentName: z
    .string()
    .min(2, "Department name is required, select from the list"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(), // Based on radio buttons
});
