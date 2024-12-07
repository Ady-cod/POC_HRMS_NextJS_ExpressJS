import { ZodError } from "zod";

export function formatZodErrors(error: ZodError): Record<string, string> {
  const formattedErrors: Record<string, string> = {};

  error.issues.forEach((issue) => {
    const field = issue.path.join("."); //  We build the field name using dot for nested fields (e.g., "address" + "street" = "address.street")
    formattedErrors[field] = issue.message; // Error message stored in the related field as property
  });

  return formattedErrors;
}
