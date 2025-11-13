"use server";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import { createDepartmentSchema, updateDepartmentSchema } from "@/schemas/departmentSchema";
import { DepartmentListItem } from "@/types/types";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
const DEPARTMENT_ENDPOINT = process.env.NEXT_PUBLIC_DEPARTMENT_ENDPOINT;

// Type guard for error objects
function isErrorObject(obj: unknown): obj is { error?: string; message?: string; zodError?: z.ZodError } {
  return typeof obj === "object" && obj !== null && ("error" in obj || "message" in obj || "zodError" in obj);
}

// Get all departments
export async function getAllDepartments(): Promise<DepartmentListItem[]> {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}${DEPARTMENT_ENDPOINT}`, {
      next: { tags: ["departments"] },
    });

    if (!response.ok) {
      let errorMessage = "Unknown error occurred";

      try {
        const errorResponse: unknown = await response.json();
        if (isErrorObject(errorResponse)) {
          errorMessage = errorResponse.error || errorResponse.message || errorMessage;
        }
      } catch {
        errorMessage = `Non-JSON response with status ${response.status}`;
      }

      throw { status: response.status, message: errorMessage };
    }

    const departments: DepartmentListItem[] = await response.json();
    return departments;
  } catch (error: unknown) {
    console.error("Caught error while retrieving departments:", error);

    if (error instanceof TypeError) {
      throw { status: 0, message: "Network error: Unable to fetch departments." };
    }

    const typedError = error as { status?: number; message?: string };
    if (typedError.status && typedError.message) {
      throw { status: typedError.status, message: typedError.message };
    }

    throw { status: 500, message: "Internal Server Error while retrieving departments." };
  }
}

// Create department
export async function createDepartment(data: z.infer<typeof createDepartmentSchema>) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}${DEPARTMENT_ENDPOINT}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, message: isErrorObject(err) ? err.error || err.message : "Server error", zodError: err.zodError };
    }

    const department = await res.json();
    revalidateTag("departments");
    return { success: true, message: "Department created", data: department };
  } catch (error) {
    console.error("Error creating department:", error);
    return { success: false, message: "Network or server error" };
  }
}

// Update department
export async function updateDepartment(id: string, data: z.infer<typeof updateDepartmentSchema>) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}${DEPARTMENT_ENDPOINT}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, message: isErrorObject(err) ? err.error || err.message : "Server error", zodError: err.zodError };
    }

    const department = await res.json();
    revalidateTag("departments");
    return { success: true, message: "Department updated", data: department };
  } catch (error) {
    console.error("Error updating department:", error);
    return { success: false, message: "Network or server error" };
  }
}

// Delete department
export async function deleteDepartment(id: string) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}${DEPARTMENT_ENDPOINT}/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw { status: res.status, message: isErrorObject(err) ? err.error || err.message : "Unknown error" };
    }

    revalidateTag("departments");
    return { message: "Department deleted" };
  } catch (error) {
    console.error("Error deleting department:", error);
    throw error;
  }
}