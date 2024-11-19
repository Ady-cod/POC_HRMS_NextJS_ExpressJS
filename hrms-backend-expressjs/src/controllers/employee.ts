import prisma from "../lib/client";
import { Request, Response } from "express";
import { Prisma, Employee, Department } from "@prisma/client";

import { createEmployeeSchema } from "../schemas/employeeSchema";
import { z } from "zod";

// Infer type from Zod schema
type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;

export const getAllEmployees = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        employeeProjects: true,
        attendanceRecords: true,
        attendanceSummaries: true,
        department: true,
        employeeLearningPathProgress: true,
      },
    });

    // console.log("Employees:", employees);

    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
};

const DEMO_MODE = process.env.DEMO_MODE || true; // Set this based on your environment

export const createEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Validate request body using Zod
    const validatedData: CreateEmployeeInput = createEmployeeSchema.parse(
      req.body
    );

    const { departmentName, ...employeeData } = validatedData;

    // Find or create department
    let department  = (await prisma.department.findUnique({
      where: { name: departmentName },
    })) as Department | null;

    if (!department) {
      if (DEMO_MODE) {
        // Create department in demo mode
        department = await prisma.department.create({
          data: { name: departmentName },
        });
      } else {
        // Return error in strict mode
        res.status(400).json({ error: "Department not found." });
        return;
      }
    }

    // Prepare the data for Prisma
    const newEmployeeData: Prisma.EmployeeCreateInput = {
      ...employeeData,
      department: { connect: { id: department.id } },
    };

    // Create the employee
    const newEmployee: Employee = await prisma.employee.create({
      data: newEmployeeData,
    });

    res.status(201).json(newEmployee);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors
      res.status(400).json({ errors: error.errors });
    } else {
      console.error("Error creating employee:", error);
      res
        .status(500)
        .json({ error: "Internal server error while creating employee" });
    }
  }
};
