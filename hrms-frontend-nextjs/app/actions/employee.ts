"use server";
import { createEmployeeSchema } from "@/schemas/employeeSchema";
import { z } from "zod";

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
