import { Gender, Role, Status } from "@prisma/client";
import prisma from "../lib/client";
import { z } from "zod";
import { isValid, parseISO } from "date-fns";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { Resolver } from "node:dns/promises";
import * as dns from "node:dns/promises";

// Helper function to capitalize the first letter of each word in a name
const capitalizeEachWord = (name: string): string =>
  name.replace(/\b[\p{L}]/gu, (char) => char.toUpperCase());

// Helper function to ensure the birth date is no older than 100 years ago
const isNotMoreThan100YearsAgo = (dateString: string): boolean => {
  const today = new Date();
  const hundredYearsAgo = new Date(
    today.getFullYear() - 100,
    today.getMonth(),
    today.getDate()
  );
  const date = parseISO(dateString);
  return isValid(date) && date >= hundredYearsAgo;
};

// Helper function to check if a birth date is at least 18 years in the past
const isAtLeast18YearsAgo = (dateString: string): boolean => {
  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  const date = parseISO(dateString);
  return isValid(date) && date <= eighteenYearsAgo;
};

// Helper function to check if a joining date is not before the company founding year
const isAfterFoundingYear = (dateString: string): boolean => {
  const foundingYear = 2021; // The founding year of the company

  // Validation uses local time because user input from <input type="date"> is local
  const minJoinDate = new Date(foundingYear, 0, 1); // January 1st of the founding year
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
};

// Helper function to check if a string is a valid email address, using a valid domain
interface DomainValidationResult {
  exchange: string;
  priority: number;
}

type ValidationMode = "strict" | "warn" | "off";

const DNS_SERVERS = process.env.DNS_SERVERS?.split(",")
  .map((server) => server.trim())
  .filter(Boolean);

const EMAIL_RESOLVER =
  DNS_SERVERS && DNS_SERVERS.length > 0
    ? (() => {
        const resolver = new Resolver();
        resolver.setServers(DNS_SERVERS);
        return resolver;
      })()
    : null;

const DNS_TIMEOUT_MS = 5000;
const DNS_WARN_INTERVAL_MS = 60_000;
let lastDnsWarningAt = 0;

const getValidationMode = (): ValidationMode => {
  const rawMode = process.env.EMAIL_DOMAIN_VALIDATION_MODE?.toLowerCase();
  if (rawMode === "strict" || rawMode === "warn" || rawMode === "off") {
    return rawMode;
  }
  return process.env.NODE_ENV === "production" ? "strict" : "warn";
};

const withTimeout = async <T>(promise: Promise<T>): Promise<T> => {
  const timeoutError = new Error("DNS_TIMEOUT") as NodeJS.ErrnoException;
  timeoutError.code = "ETIMEDOUT";
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(timeoutError), DNS_TIMEOUT_MS)
    ),
  ]);
};

const logDnsWarning = (message: string): void => {
  const now = Date.now();
  if (now - lastDnsWarningAt < DNS_WARN_INTERVAL_MS) {
    return;
  }
  lastDnsWarningAt = now;
  console.warn(message);
};

const getResolver = (): Resolver | null => EMAIL_RESOLVER;

async function isDomainValid(email: string): Promise<boolean> {
  const mode = getValidationMode();
  if (mode === "off") {
    return true;
  }

  const domain = email.split("@")[1]?.trim();
  if (!domain) return false; // Invalid if no domain part exists

  const resolver = getResolver();
  const resolveMx = resolver
    ? resolver.resolveMx.bind(resolver)
    : dns.resolveMx;
  const resolve4 = resolver
    ? resolver.resolve4.bind(resolver)
    : dns.resolve4;
  const resolve6 = resolver
    ? resolver.resolve6.bind(resolver)
    : dns.resolve6;

  const fallbackToAddressRecords = async (): Promise<boolean> => {
    const [aResult, aaaaResult] = await Promise.allSettled([
      withTimeout(resolve4(domain)),
      withTimeout(resolve6(domain)),
    ]);

    const hasA =
      aResult.status === "fulfilled" && aResult.value.length > 0;
    const hasAAAA =
      aaaaResult.status === "fulfilled" && aaaaResult.value.length > 0;

    return hasA || hasAAAA;
  };

  try {
    const records: DomainValidationResult[] = await withTimeout(resolveMx(domain));
    if (records.length > 0) {
      return true;
    }
    return await fallbackToAddressRecords();
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    const code = err.code ?? "UNKNOWN";

    if (code === "ENOTFOUND") {
      return false;
    }

    if (code === "ENODATA") {
      return await fallbackToAddressRecords();
    }

    const isNetworkError = [
      "ECONNREFUSED",
      "ETIMEDOUT",
      "EAI_AGAIN",
      "SERVFAIL",
    ].includes(code);

    if (isNetworkError) {
      if (mode === "warn") {
        logDnsWarning(
          `[email-validation] DNS lookup failed for ${domain} (code=${code}) -> allowing`
        );
        return true;
      }
      return false;
    }

    if (mode === "warn") {
      logDnsWarning(
        `[email-validation] DNS lookup error for ${domain} (code=${code}) -> allowing`
      );
      return true;
    }

    return false;
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
        "Employee name must only contain letters (3 minimum), spaces, apostrophes, hyphens and start/end with a letter",
    })
    .refine(isSafeString, {
      message: 'Employee name contains unsafe characters like <, >, ", `, or &',
    })
    .refine((name) => !name.includes("  "), {
      message: "Employee name must not contain consecutive spaces",
    })
    .refine((name) => !name.includes("--"), {
      message: "Employee name must not contain consecutive hyphens",
    })
    .refine((name) => !name.includes("''"), {
      message: "Employee name must not contain consecutive apostrophes",
    })
    .transform(capitalizeEachWord),
  email: z
    .string()
    .email("Invalid email address, use the format email@example.com")
    .refine(async (email) => await isEmailUnique(email), {
      message: "This email is already in use, please use a different email",
    })
    .refine(async (email) => await isDomainValid(email), {
      message:
        "This email domain doesn't exist, use a valid domain format like example.com",
    })
    .refine(
      (email) =>
        !email.split("@")[0].startsWith("-") &&
        !email.split("@")[0].endsWith("-"),
      {
        message: "Email username cannot start or end with a hyphen",
      }
    ),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(16, "Password must not exceed 16 characters")
    .regex(/\p{Ll}/u, "Password must include at least one lowercase letter")
    .regex(/\p{Lu}/u, "Password must include at least one uppercase letter")
    .regex(/\d/u, "Password must include at least one digit")
    .regex(
      /[^\p{L}\d]/u,
      "Password must include at least one special character"
    ),
  phoneNumber: z.string().refine(isValidPhoneNumber, {
    message:
      "Invalid phone number format. Use international format (e.g., +123456789)",
  }), // Validate as a phone number
  country: z
    .string()
    .min(2, "Country name must be at least 2 characters long."),
  countryCode: z
    .string()
    .optional()
    .transform((value) => value ?? null), // Ensure countryCode is null if undefined in order to match Prisma's expected input
  state: z.string().min(2, "State name must be at least 2 characters long."),
  stateCode: z
    .string()
    .optional()
    .transform((value) => value ?? null), // Ensure stateCode is null if undefined in order to match Prisma's expected input
  city: z.string().min(2, "City name must be at least 2 characters long."),
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
  departmentId: z
    .string()
    .min(1, "Please select a department")
    .uuid("Invalid department ID format"),
  gender: z.nativeEnum(Gender).optional().default(Gender.OTHER), // Based on radio buttons
  inductionCompleted: z.boolean().optional().default(false), // Default to false
  // Role is optional. If not provided, default to INTERN. If provided but not
  // part of the allowed enum, raise a clear validation error.
  role: z
    .preprocess(
      (val) => (val === "" || val == null ? undefined : String(val).trim()),
      z
        .custom<Role>(
          (v): v is Role => (Object.values(Role) as string[]).includes(v),
          {
            message: "Invalid role selection. Please choose a valid role.",
          }
        )
        .optional()
    )
    .default(Role.INTERN),

  status: z.nativeEnum(Status).optional().default(Status.ACTIVE), // Default to ACTIVE
});

// Zod schema for employee update
export const updateEmployeeSchema = z.object({
  fullName: z
    .string()
    .min(3, "Employee name is required with a minimum of 3 characters")
    .refine(isValidUnicodeName, {
      message:
        "Employee name must only contain letters (3 minimum), spaces, apostrophes, hyphens and start/end with a letter",
    })
    .refine(isSafeString, {
      message: 'Employee name contains unsafe characters like <, >, ", `, or &',
    })
    .refine((name) => !name.includes("  "), {
      message: "Employee name must not contain consecutive spaces",
    })
    .refine((name) => !name.includes("--"), {
      message: "Employee name must not contain consecutive hyphens",
    })
    .refine((name) => !name.includes("''"), {
      message: "Employee name must not contain consecutive apostrophes",
    })
    .optional()
    .transform((value) => (!value ? null : capitalizeEachWord(value))),
  email: z
    .string()
    .email("Invalid email address, use the format email@example.com")
    .refine(async (email) => await isEmailUnique(email), {
      message: "This email is already in use, please use a different email",
    })
    .refine(async (email) => await isDomainValid(email), {
      message:
        "This email domain doesn't exist, use a valid domain format like example.com",
    })
    .refine(
      (email) =>
        !email.split("@")[0].startsWith("-") &&
        !email.split("@")[0].endsWith("-"),
      {
        message: "Email username cannot start or end with a hyphen",
      }
    )
    .optional()
    .transform((value) => (!value ? null : value)),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(16, "Password must not exceed 16 characters")
    .regex(/\p{Ll}/u, "Password must include at least one lowercase letter")
    .regex(/\p{Lu}/u, "Password must include at least one uppercase letter")
    .regex(/\d/u, "Password must include at least one digit")
    .regex(
      /[^\p{L}\d]/u,
      "Password must include at least one special character"
    )
    .optional()
    .transform((value) => (!value ? null : value)),
  phoneNumber: z
    .string()
    .refine(isValidPhoneNumber, {
      message:
        "Invalid phone number format. Use international format (e.g., +123456789)",
    })
    .optional()
    .transform((value) => (!value ? null : value)),
  country: z
    .string()
    .min(2, "Country name must be at least 2 characters long if provided.")
    // .transform(capitalizeEachWord)
    .optional(),
  countryCode: z.string().optional(),
  state: z
    .string()
    .min(2, "State name must be at least 2 characters long if provided.")
    // .transform(capitalizeEachWord)
    .optional(),
  stateCode: z.string().optional(),
  city: z
    .string()
    .min(2, "City name must be at least 2 characters long if provided.")
    // .transform(capitalizeEachWord)
    .optional(),
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
    .transform((date) => `${date}T00:00:00.000Z`) // Appends time to the date to match Prisma's DateTime
    .optional()
    .transform((value) => (!value ? null : value)),
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
    .transform((date) => `${date}T00:00:00.000Z`) // Appends time to the date to match Prisma's DateTime
    .optional()
    .transform((value) => (!value ? null : value)),
  departmentId: z
    .string()
    .min(1, "Please select a department")
    .uuid("Invalid department ID format")
    .optional(),
  gender: z
    .nativeEnum(Gender) // Based on radio buttons
    .optional()
    .transform((value) => (!value ? null : value)),
  inductionCompleted: z.boolean().optional(),
  role: z
    .preprocess(
      (val) => (val === "" || val == null ? undefined : String(val).trim()),
      z.string().optional()
    )
    .refine(
      (v) =>
        v === undefined ||
        (typeof v === "string" &&
          (Object.values(Role) as string[]).includes(v)),
      {
        message: "Invalid role selection. Please choose a valid role.",
      }
    ),
  status: z
    .preprocess(
      (val) => (val === "" || val == null ? undefined : String(val).trim()),
      z.string().optional()
    )
    .refine(
      (v) =>
        v === undefined ||
        (typeof v === "string" &&
          (Object.values(Status) as string[]).includes(v)),
      {
        message: "Invalid status selection. Please choose a valid status.",
      }
    ),

  // timezone field added
  timezone: z
    .string()
    .optional()
    .nullable()
    .transform((value) => (!value ? null : value)),
});
