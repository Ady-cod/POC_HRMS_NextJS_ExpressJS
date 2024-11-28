import { ZodError } from "zod";

export function formatZodErrors(error: ZodError): Record<string, string> {
  const formattedErrors: Record<string, string> = {};

  error.errors.forEach((err) => {
    const field = err.path.join("."); //  We build the field name using dot for nested fields (e.g., "email")
    formattedErrors[field] = err.message; // Error message stored in the related field as property
  });

  return formattedErrors;
}
