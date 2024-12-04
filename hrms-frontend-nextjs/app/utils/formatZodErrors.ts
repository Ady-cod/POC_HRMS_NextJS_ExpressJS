import { ZodError } from "zod";

export function formatZodErrors(errors: ZodError["errors"]): Record<string, string> {
  const formattedErrors: Record<string, string> = {};

  errors.forEach((err) => {
    const field = err.path.join("."); //  We build the field name using dot for nested fields (e.g., "address" + "street" = "address.street")
    formattedErrors[field] = err.message; // Error message stored in the related field as property
  });

  return formattedErrors;
}
