import prisma from "../lib/client";
import { z } from "zod";

// Helper: capitalize each word
const capitalizeEachWord = (name: string): string =>
  name.replace(/\b[\p{L}]/gu, (char) => char.toUpperCase());

// Helper: prevent XSS or unsafe input
const isSafeString = (input: string): boolean => {
  return !input.match(/[<>"&`]/); // Disallow HTML injection symbols
};

const isValidUnicodeName = (input: string): boolean =>
  /^[\p{L}][\p{L}\s'\-]*[\p{L}]$/u.test(input);


// CREATE schema
export const createDepartmentSchema = z.object({
  name: z
    .string()
    .min(2)
    .refine(isValidUnicodeName, {
      message:
        "Department name must only contain letters, spaces, apostrophes, hyphens and start/end with a letter",
    })
    .transform(capitalizeEachWord),

  description: z
    .string()
    .min(1, "Description is required")
    .optional()
    .transform((val) => (!val || val.trim() === "" ? null : val))
    .refine((val) => val === null || isSafeString(val), {
      message: 'Description contains unsafe characters like <, >, ", `, or &',
    })
    .refine((val) => val === null || val.trim().split(/\s+/).length <= 24, {
      message: "Description must be 24 words or less",
    }),

   headOfDep: z
   .string()
   .optional(),

    icon: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || [
          "icon-1",
          "icon-2",
          "icon-3",
          "icon-4",
          "icon-5",
          "icon-6",
          "icon-7",
          "icon-8",
        ].includes(val),
      { message: "Invalid icon selected" }
    )
});

// UPDATE schema
export const updateDepartmentSchema = z.object({
  name: z
    .string()
    .min(2)
    .refine(isValidUnicodeName, {
      message:
        "Department name must only contain letters, spaces, apostrophes, hyphens and start/end with a letter",
    })
    .optional()
    .transform((val) => (!val ? null : capitalizeEachWord(val))),

  description: z
    .string()
    .min(1, "Description is required")
    .optional()
    .transform((val) => (!val || val.trim() === "" ? null : val))
    .refine((val) => val === null || isSafeString(val), {
      message: 'Description contains unsafe characters like <, >, ", `, or &',
    })
    .refine((val) => val === null || val.trim().split(/\s+/).length <= 24, {
      message: "Description must be 24 words or less",
    }),

  headOfDep: z
    .string()
    .min(2)
    .optional(),

  icon: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || [
          "icon-1",
          "icon-2",
          "icon-3",
          "icon-4",
          "icon-5",
          "icon-6",
          "icon-7",
          "icon-8",
        ].includes(val),
      { message: "Invalid icon selected" }
    ),
});