import { Gender, Role, Status } from "@prisma/client";
import prisma from "../lib/client";
import { z } from "zod";
import { isValid, parseISO } from "date-fns";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import dns from "dns/promises";


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

// helper function to check if an email breaks the unique constraint
const isEmailUnique = async (email: string): Promise<boolean> => {
  const existingEmployee = await prisma.employee.findUnique({
    where: {
      email: email,
    },
  });
  return !existingEmployee;
}

// Helper function to check if a string is a valid email address, using a valid domain
interface DomainValidationResult {
  exchange: string;
  priority: number;
}

async function isDomainValid(email: string): Promise<boolean> {
  // Extract the domain part of the email
  const domain = email.split("@")[1];
  if (!domain) return false; // Invalid if no domain part exists
  try {
    const records: DomainValidationResult[] = await dns.resolveMx(domain); // Checks for MX records
    return records.length > 0; // Valid if there are mail servers
  } catch {
    return false; // Invalid if no MX records
  }
}

// Helper function to check if a string is a valid phone number
const isValidPhoneNumber = (phoneNumber: string): boolean => {
  if (!phoneNumber) return false; // Disallow empty strings
  const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber);
  return parsedPhoneNumber?.isValid() || false;
};

// Helper function to check if a string is a valid date
const isValidDate = (dateString: string): boolean => {
  if (!dateString) return false; // Disallow empty strings
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
    .min(3, "Employee name is required with a minimum of 3 characters")
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
    .refine(async (email) => await isEmailUnique(email), {
      message: "This email is already in use, please use a different email",
    })
    .refine(async (email) => await isDomainValid(email), {
      message:
        "This email domain doesn't exist, use a valid domain format like example.com",
    }),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string().refine(isValidPhoneNumber, {
    message:
      "Invalid phone number format. Use international format (e.g., +123456789)",
  }), // Validate as a phone number
  country: z
    .string()
    .min(2, "Country is required")
    .refine(isValidUnicodeName, {
      message:
        "Country must only contain letters, spaces, apostrophes, and hyphens",
    })
    .refine(isSafeString, {
      message: 'Country contains unsafe characters like <, >, ", ` or &',
    }),
  city: z
    .string()
    .min(3, "City is required with a minimum of 3 characters")
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
    .optional()
    .transform((value) => (!value ? null : value)),
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
    })
    .transform((date) => `${date}T00:00:00.000Z`), // Appends time to the date to match Prisma's DateTime
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
    })
    .transform((date) => `${date}T00:00:00.000Z`), // Appends time to the date to match Prisma's DateTime
  departmentName: z.string().min(2, "Department name is required"),
  gender: z.nativeEnum(Gender).optional().default(Gender.OTHER), // Based on radio buttons
  inductionCompleted: z.boolean().optional().default(false), // Default to false
  role: z.nativeEnum(Role).optional().default(Role.EMPLOYEE), // Default to EMPLOYEE
  status: z.nativeEnum(Status).optional().default(Status.ACTIVE), // Default to ACTIVE
});
