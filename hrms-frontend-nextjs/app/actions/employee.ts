"use server";
import { EmployeeListItem } from "@/types/types";
import { createEmployeeSchema } from "@/schemas/employeeSchema";
import { z } from "zod";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
const EMPLOYEE_ENDPOINT = process.env.NEXT_PUBLIC_EMPLOYEE_ENDPOINT;

export async function getAllEmployees(): Promise<EmployeeListItem[]> {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}${EMPLOYEE_ENDPOINT}`, {
      cache: "no-store", // Ensure no caching for fresh data
    });

    if (!response.ok) {
      const errorResponse = await response.json();

      // Check if the error response has an 'error' or 'message' field
      const errorMessage =
        errorResponse.error ||
        errorResponse.message ||
        "Unknown error occurred";

      throw { status: response.status, message: errorMessage };
    }

    const employees = await response.json();
    return employees;
  } catch (error: Error | unknown) {
    // log the error details for developers
    console.error("Caught error while retrieving employees:", error);

    // Handle network-related issues (TypeError) separately
    if (error instanceof TypeError) {
      // Log specific network-related issues
      console.error("Network error while retrieving employees:", error.message);

      // Throw a custom error for user-facing purposes
      throw { status: 0, message: "Network error: Unable to fetch employees." };
    }

    // If we caught an error we threw earlier (with a status and message), pass it along
    const typedError = error as { status?: number; message?: string };
    if (typedError.status && typedError.message) {
      throw { status: typedError.status, message: typedError.message };
    }

    // Fallback for unknown errors (unexpected issues)
    throw { status: 500, message: "Internal Server Error while attempting retrieve employees." };

    // Fallback return  to match the return type of the function
    return [];
  }
}
//delete operations
export async function deleteEmployee(id:string): Promise<{message:string}>{
  try{
    const response = await fetch(`${BACKEND_BASE_URL}${EMPLOYEE_ENDPOINT}/${id}`,
      {
        method: "DELETE",
      }
    );

    if(!response.ok){
      const errorResponse = await response.json();
      const errorMessage = errorResponse.error || "Unknown error occurred";

      throw { status: response.status, message: errorMessage };
    }
    return await response.json();
  }catch(error){
    console.error("Error deleting employee:", error);
    throw { status: 500, message: "Internal Server Error while deleting employee." };

  }
}

export async function createEmployee(
  validatedData: z.infer<typeof createEmployeeSchema>
): Promise<void> {

  try {
    // Send the data to the server
    const response = await fetch(`${BACKEND_BASE_URL}${EMPLOYEE_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to create employee:", error);

      // Check if backend returned zod validation errors
      if (response.status === 400 && error.errors) {
        // Throw validation errors packed into a single message, to be handled by ModalForm
        const errorValidationMessage: string = error.errors
          .map((err: { message: string }) => err.message)
          .join("\n\n");
        throw new Error(`Validation Error(s):\n\n${errorValidationMessage}`);
      }

      // Use a meaningful fallback message if the server doesn't send one
      const errorMessage =
        error.error || "An unknown error occurred on the server.";
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log("Employee successfully created:", result);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating employee:", error);
      throw new Error(`${error.message}`);
    } else {
      console.error("Error creating employee:", error);
      throw new Error("Failed to create employee: Unknown error");
    }
  }
}
