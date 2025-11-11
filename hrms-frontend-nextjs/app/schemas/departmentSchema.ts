import { z } from "zod";

//  Helper: capitalize each word
const capitalizeEachWord = (name: string): string =>
  name.replace(/\b[\p{L}]/gu, (char) => char.toUpperCase());

//  Helper: prevent XSS or unsafe input
const isSafeString = (input: string): boolean => {
  return !input.match(/[<>"&`]/); // Prevents HTML injection
};

const isValidUnicodeName = (input: string): boolean =>
  /^[\p{L}][\p{L}\s'\-]*[\p{L}]$/u.test(input);

const allowedIcons = [
  "icon-1",
  "icon-2",
  "icon-3",
  "icon-4",
  "icon-5",
  "icon-6",
  "icon-7",
  "icon-8",
];

// CREATE schema
export const createDepartmentSchema = z.object({
  name: z
    .string()
    .min(2, "Department name must contain at least 2 characters")
    .refine(isValidUnicodeName, {
      message:
        "Department name must only contain letters, spaces, apostrophes, hyphens and start/end with a letter",
    })
    .refine((name) => !name.includes("  "), {
      message: "Department name must not contain consecutive spaces",
    })
    .refine((name) => !name.includes("--"), {
      message: "Department name must not contain consecutive hyphens",
    })
    .transform(capitalizeEachWord),

  description: z
    .string()
    .min(1, "Description is required")
    .refine(isSafeString, {
      message:
        'Description contains unsafe characters like <, >, ", `, or &',
    })
    .refine((val) => val.trim().split(/\s+/).length <= 24, {
      message: "Description must be 24 words or less",
    })
    .optional()
    .transform((value) => (!value ? null : value)),

  headOfDep: z
    .string()
    .refine((val) => val !== "", { message: "Head of department is required" }),

   icon: z
    .string()
    .refine((val) => allowedIcons.includes(val), { message: "Invalid icon selected" }),
});

// UPDATE schema
export const updateDepartmentSchema = z.object({
  name: z
    .string()
    .min(2, "Department name must contain at least 2 characters")
    .refine(isValidUnicodeName, {
      message:
        "Department name must only contain letters, spaces, apostrophes, hyphens and start/end with a letter",
    })
    .refine((name) => !name.includes("  "), {
      message: "Department name must not contain consecutive spaces",
    })
    .refine((name) => !name.includes("--"), {
      message: "Department name must not contain consecutive hyphens",
    })
    .optional()
    .transform((value) => (value ? capitalizeEachWord(value) : undefined)),

  description: z
    .string()
    .min(1, "Description is required")
    .refine(isSafeString, {
      message:
        'Description contains unsafe characters like <, >, ", `, or &',
    })
    .refine((val) => val.trim().split(/\s+/).length <= 24, {
      message: "Description must be 24 words or less",
    })
    .optional()
    .transform((value) => (value ? value : undefined)),

  headOfDep: z
    .string()
    .optional()
    .refine((id) => id === undefined || id !== "", {
      message: "Head of department must be selected"
    }),

  icon: z
    .string()
    .optional()
    .refine((val) => !val || allowedIcons.includes(val), { message: "Invalid icon selected" }),
});