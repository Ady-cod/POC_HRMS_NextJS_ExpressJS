import { z } from "zod";
import { isValid, parseISO } from "date-fns";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { parse } from "tldts";
import { EmployeeRole, EmployeeStatus } from "@/types/types";

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
export const createEmployeeSchema = (hasFetched: boolean) =>
  z
    .object({
      fullName: z
        .string()
        .min(3, "Employee name is required, with a minimum of 3 characters")
        .refine(isValidUnicodeName, {
          message:
            "Employee name must only contain letters (3 minimum), spaces, apostrophes, hyphens and start/end with a letter",
        })
        .refine(isSafeString, {
          message:
            'Employee name contains unsafe characters like <, >, ", `, or &',
        })
        .refine((name) => !name.includes("  "), {
          message: "Employee name must not contain consecutive spaces",
        })
        .refine((name) => !name.includes("--"), {
          message: "Employee name must not contain consecutive hyphens",
        })
        .refine((name) => !name.includes("''"), {
          message: "Employee name must not contain consecutive apostrophes",
        }),
      email: z
        .string()
        .email("Invalid email address, use the format email@example.com")
        .refine((email) => isValidEmailDomain(email), {
          message: "Invalid email domain, use a valid format like example.com",
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
      }),
      country: hasFetched
        ? z.string().min(2, "Select a country") // Adjust the validation message based on the fetch status
        : z
            .string()
            .min(2, "Country is required with at least 2 characters long"), // Default message when fetch is not done
      countryCode: z.string().optional(),
      state: hasFetched
        ? z.string().min(2, "Select a state") // Adjust the validation message based on the fetch status
        : z
            .string()
            .min(2, "State is required with at least 2 characters long"), // Default message when fetch is not done
      stateCode: z.string().optional(),
      city: hasFetched
        ? z.string().min(2, "Select a city") // Only validate when hasFetched is true
        : z.string().min(2, "City is required with at least 2 characters long"), // Default message when fetch is not done
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
          message:
            "Invalid date of joining format, expected a valid YYYY-MM-DD",
        })
        .refine(isNotFutureDate, {
          message: "Joining date cannot be in the future.",
        })
        .refine(isAfterFoundingYear, {
          message: "Joining date cannot be less than 2021.",
        }),
      departmentId: z
        .string()
        .min(1, "Department selection is required")
        .refine((id) => /^[a-f\d]{24}$/i.test(id), {
          message: "Invalid department ID format",
        }),
      gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(), // Based on radio buttons
      // Role is optional; default to INTERN if missing/empty; validate if provided
      role: z
        .preprocess(
          (val) => (val === "" || val == null ? undefined : String(val).trim()),
          z
            .custom<EmployeeRole>(
              (v): v is EmployeeRole =>
                (Object.values(EmployeeRole) as string[]).includes(v),
              {
                message: "Invalid role selection. Please choose a valid role.",
              }
            )
            .optional()
        )
        .default(EmployeeRole.INTERN),
    })
    .refine(() => hasFetched, {
      message:
        "Unable to submit the form due to error in fetching countries/states/cities. Please try again later or inform the technical team.",
    });

// Zod schema for employee update
export const updateEmployeeSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "Employee name is required, with a minimum of 3 characters")
      .refine(isValidUnicodeName, {
        message:
          "Employee name must only contain letters (3 minimum), spaces, apostrophes, hyphens and start/end with a letter",
      })
      .refine(isSafeString, {
        message:
          'Employee name contains unsafe characters like <, >, ", `, or &',
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
      .optional(),
    email: z
      .string()
      .email("Invalid email address, use the format email@example.com")
      .refine((email) => isValidEmailDomain(email), {
        message: "Invalid email domain, use a valid format like example.com",
      })
      .refine(
        (email) =>
          !email.split("@")[0].startsWith("-") &&
          !email.split("@")[0].endsWith("-"),
        {
          message: "Email username cannot start or end with a hyphen",
        }
      )
      .optional(),
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
      .optional(),
    phoneNumber: z
      .string()
      .refine(isValidPhoneNumber, {
        message:
          "Invalid phone number format. Use international format (e.g., +123456789)",
      })
      .optional(),
    country: z
      .string()
      .min(2, "Country name must be at least 2 characters long if provided.")
      .optional(),
    countryCode: z
      .string()
      .min(2, "Country code must be at least 2 characters long if provided.")
      .optional(),
    state: z
      .string()
      .min(2, "State name must be at least 2 characters long if provided.")
      .optional(),
    stateCode: z
      .string()
      .min(2, "State code must be at least 2 characters long if provided.")
      .optional(),
    city: z
      .string()
      .min(2, "City name must be at least 2 characters long if provided.")
      .optional(),
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
      })
      .optional(),
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
      .optional(),
    departmentId: z
      .string()
      .min(1, "Department selection is required")
      .refine((id) => /^[a-f\d]{24}$/i.test(id), {
        message: "Invalid department ID format",
      })
      .optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(), // Based on radio buttons
    role: z.preprocess(
      (val) => (val === "" || val == null ? undefined : String(val).trim()),
      z
        .custom<EmployeeRole>(
          (v): v is EmployeeRole =>
            (Object.values(EmployeeRole) as string[]).includes(v),
          {
            message: "Invalid role selection. Please choose a valid role.",
          }
        )
        .optional()
    ),
    status: z.preprocess(
      (val) => (val === "" || val == null ? undefined : String(val).trim()),
      z
        .custom<EmployeeStatus>(
          (v): v is EmployeeStatus =>
            (Object.values(EmployeeStatus) as string[]).includes(v),
          {
            message: "Invalid status selection. Please choose a valid status.",
          }
        )
        .optional()
    ),
  })
  .superRefine((data, ctx) => {
    // If new value is provided for country, state should change accordingly
    if (data.country && !data.state) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["state"], // Points directly to the state field
        message: "State must be selected if a new country is provided.",
      });
    }

    // If new value is provided for state, city should change accordingly
    if (data.state && !data.city) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["city"], // Points directly to the city field
        message: "City must be selected if a new state is provided.",
      });
    }
  });
