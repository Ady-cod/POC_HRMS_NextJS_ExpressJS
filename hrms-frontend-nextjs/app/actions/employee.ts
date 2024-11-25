"use server";
import { createEmployeeSchema } from "@/schemas/employeeSchema";
import { z } from "zod";
import { EmployeeListItem } from "@/types/types";

export async function getAllEmployees(): Promise<EmployeeListItem[]> {
  try {
    const response = await fetch("http://localhost:5000/api/v1/employee", {
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

export async function createEmployee(
  validatedData: z.infer<typeof createEmployeeSchema>
): Promise<void> {

  try {
    // Send the data to the server
    const response = await fetch("http://localhost:5000/api/v1/employee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to create employee:", error);

      // Use a meaningful fallback message if the server doesn't send one
      const errorMessage =
        error.error || "An unknown error occurred on the server.";
      throw new Error(errorMessage);

      //   throw new Error(`Error from the server: ${error.message}`);
    }

    const result = await response.json();
    console.log("Employee successfully created:", result);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating employee:", error);
      throw new Error(`Failed to create employee: ${error.message}`);
    } else {
      console.error("Error creating employee:", error);
      throw new Error("Failed to create employee: Unknown error");
    }
  }
}
