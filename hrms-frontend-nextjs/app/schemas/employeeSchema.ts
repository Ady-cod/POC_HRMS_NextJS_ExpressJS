import { z } from "zod";
import { isValid, parseISO } from "date-fns";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { parse } from "tldts"

// Helper function to ensure the birth date is no older than 100 years ago
const isNotMoreThan100YearsAgo = (dateString: string): boolean => {
  const today = new Date();
  const hundredYearsAgo = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
  const date = parseISO(dateString);
  return isValid(date) && date >= hundredYearsAgo;
};

// Helper function to check if a birth date is at least 18 years in the past
const isAtLeast18YearsAgo = (dateString: string): boolean => {
  const today = new Date();
  const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  const date = parseISO(dateString);
  return isValid(date) && date <= eighteenYearsAgo;
};

// Helper function to check if a joining date is not before the company founding year
const isAfterFoundingYear = (dateString: string): boolean => {
  const foundingYear = 2021; // The founding year of the company
  const minJoinDate = new Date(Date.UTC(foundingYear, 0, 1));
  const date = parseISO(dateString);
  return isValid(date) && date >= minJoinDate;
};

// Helper function to check if a joining date is not in the future
const isNotFutureDate = (dateString: string): boolean => {
  const today = new Date();
  const date = parseISO(dateString);
  return isValid(date) && date <= today;
};

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
  /^[\p{L}][\p{L}\s'\-]*[\p{L}]$/u.test(input);

// Zod schema for employee creation
export const createEmployeeSchema = z.object({
  fullName: z
    .string()
    .min(3, "Employee name is required, min 3 characters")
    .refine(isValidUnicodeName, {
      message:
        "Employee name must only contain letters, spaces, apostrophes, hyphens and start/end with a letter",
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
  birthDate: z
    .string()
    .refine(isValidDate, {
      message: "Invalid birth date format, expected a valid YYYY-MM-DD",
    })
    .refine(isAtLeast18YearsAgo, {
      message: "Birth date must be at least 18 years ago.",
    })
    .refine(isNotMoreThan100YearsAgo, {
      message:
        "Birth date goes too far in the past. Please check your typed year",
    }),
  dateOfJoining: z
    .string()
    .refine(isValidDate, {
      message: "Invalid date of joining format, expected a valid YYYY-MM-DD",
    })
    .refine(isNotFutureDate, {
      message: "Joining date cannot be in the future.",
    })
    .refine(isAfterFoundingYear, {
      message: "Joining date cannot be less than 2021.",
    }),
  departmentName: z
    .string()
    .min(2, "Department name is required, select from the list"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(), // Based on radio buttons
});
