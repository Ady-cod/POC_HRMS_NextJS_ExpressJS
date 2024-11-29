import { z } from "zod";
import { isValid, parseISO } from "date-fns";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import {parse} from "tldts"

// Helper function to check if an email has a valid domain
const isValidEmailDomain = (email: string): boolean => {
  // Parse the email into the object containing the domain
  const result = parse(email);

  // Check if the domain is valid
  return result.domain !== null && result.isIcann === true;
};

// Helper function to check if a string is a valid phone number
const isValidPhoneNumber = (phoneNumber: string): boolean => {
  if (!phoneNumber) return false; // Phone number is required
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

// Helper function to check if a string contains hacking attempts
const isSafeString = (input: string): boolean => {
  return !input.match(/[<>"&`]/); // Prevents XSS attacks
};

// Helper function to check if a string is a valid Unicode name
const isValidUnicodeName = (input: string): boolean =>
  /^[\p{L}\s'\-]+$/u.test(input);

// Zod schema for employee creation
export const createEmployeeSchema = z.object({
  fullName: z
    .string()
    .min(3, "Employee name is required, min 3 characters")
    .refine(isValidUnicodeName, {
      message:
        "Employee name must only contain letters, spaces, apostrophes, and hyphens",
    })
    .refine(isSafeString, {
      message: 'Employee name contains unsafe characters like <, >, ", `, or &',
    }),
  email: z
    .string()
    .email("Invalid email address, use the format email@example.com")
    .refine((email) => isValidEmailDomain(email), {
      message: "Invalid email domain, use a valid format like example.com",
    }),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string().refine(isValidPhoneNumber, {
    // Validate as a phone number
    message:
      "Invalid phone number format. Use international format (e.g., +123456789)",
  }),
  country: z
    .string()
    .min(2, "Country is required, min 2 characters")
    .refine(isValidUnicodeName, {
      message:
        "Country must only contain letters, spaces, apostrophes, and hyphens",
    })
    .refine(isSafeString, {
      message: 'Country contains unsafe characters like <, >, ", ` or &',
    }),
  city: z
    .string()
    .min(3, "City is required, min 3 characters")
    .refine(isValidUnicodeName, {
      message:
        "City must only contain letters, spaces, apostrophes, and hyphens",
    })
    .refine(isSafeString, {
      message: 'City contains unsafe characters like <, >, " , `, or &',
    }),
  streetAddress: z
    .string()
    .refine(isSafeString, {
      message: 'Street contains unsafe characters like <, >, ", `, or &',
    })
    .optional(),
  birthDate: z.string().refine(isValidDate, {
    message: "Invalid birth date format, expected a valid YYYY-MM-DD",
  }), // Validate as a date format
  dateOfJoining: z.string().refine(isValidDate, {
    message: "Invalid date of joining format, expected a valid YYYY-MM-DD",
  }), // Validate as a date format
  departmentName: z
    .string()
    .min(2, "Department name is required, select from the list"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(), // Based on radio buttons
});
