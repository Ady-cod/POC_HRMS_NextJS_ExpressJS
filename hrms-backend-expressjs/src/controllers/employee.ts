import { Request, Response } from "express";
import { ObjectId } from "mongodb";

import prisma from "../lib/client";
import { Prisma, Employee, Department } from "@prisma/client";

import { createEmployeeSchema } from "../schemas/employeeSchema";
import { updateEmployeeSchema } from "../schemas/employeeSchema";
import { z } from "zod";

import bcrypt from "bcrypt";

// Infer type from Zod schema
type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;

// Define a function to hash passwords
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// Define a function to verify passwords
const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const getAllEmployees = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        employeeProjects: {
          select: {
            project: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
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
    // Validate request body using Zod (assumes `role` is included in schema)
    const validatedData: CreateEmployeeInput =
      await createEmployeeSchema.parseAsync(req.body);

    const { departmentName, password, ...employeeData } = validatedData;

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Find or create department
    let department = await prisma.department.findUnique({
      where: { name: departmentName },
    });

    if (!department) {
      if (DEMO_MODE) {
        department = await prisma.department.create({
          data: { name: departmentName },
        });
      } else {
        res.status(400).json({ error: "Department not found." });
        return;
      }
    }

    // Prepare data for Prisma
    const newEmployeeData: Prisma.EmployeeCreateInput = {
      ...employeeData,
      password: hashedPassword,
      department: { connect: { id: department.id } },
    };

    // Create employee
    const newEmployee = await prisma.employee.create({
      data: newEmployeeData,
    });

    res.status(201).json(newEmployee);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ zodError: error });
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const targetField = error.meta?.target || "unique field";
        const message = `A record with this ${targetField} already exists.`;
        console.error("Prisma Unique Constraint Error:", message);
        res.status(409).json({ error: message });
      } else {
        console.error("Prisma Error:", error.message);
        res.status(500).json({
          error: "A database error occurred. Please try again later.",
        });
      }
    } else if (error instanceof Error) {
      console.error("Error creating employee:", error.message);
      res.status(500).json({ error: error.message });
    } else {
      console.error("Unknown error:", error);
      res
        .status(500)
        .json({ error: "An unknown error occurred. Please try again later." });
    }
  }
};


export const deleteEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: "Employee ID is required" });
      return;
    }
    const deletedEmployee = await prisma.employee.delete({
      where: { id },
    });
    res
      .status(200)
      .json({ message: "Employee deleted successfully", deletedEmployee });
  } catch (error) {
    console.log("Error on deleting Employee:", error);
    res.status(500).json({ error: "Failed to delete employee" });
  }
};

export const updateEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res
        .status(400)
        .json({
          error:
            "The update cannot be performed without a valid employee ID. \nContact support.",
        });
      return;
    }

    // Validate request body using Zod
    const validatedData: UpdateEmployeeInput =
      await updateEmployeeSchema.parseAsync(req.body);

    const { departmentName, password, ...employeeData } = validatedData;

    // Filter out undefined properties from employeeData in order to match Prisma's update type
    // and filter out null values to avoid frontend empty values (left unfilled) being set as null in the database
    const filteredEmployeeData = Object.fromEntries(
      Object.entries(employeeData).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    let hashedPassword: string | null = null;
    if (password) {
      // Hash the password
      hashedPassword = await hashPassword(password);
    }

    let department: Department | null = null;
    if (departmentName) {
      // Find or create department
      department = await prisma.department.findUnique({
        where: { name: departmentName },
      });

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
    }

    // Prepare the data for Prisma
    const updatedEmployeeData: Prisma.EmployeeUpdateInput = {
      ...filteredEmployeeData,
    };

    if (password && hashedPassword) {
      updatedEmployeeData.password = hashedPassword;
    }

    if (department) {
      updatedEmployeeData.department = { connect: { id: department.id } };
    }

    // Update the employee
    const updatedEmployee: Employee = await prisma.employee.update({
      where: { id },
      data: updatedEmployeeData,
    });

    res.status(200).json(updatedEmployee);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors and passing them to the frontend
      res.status(400).json({ zodError: error });
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle Prisma-specific errors
      if (error.code === "P2002") {
        // Unique constraint violation
        const targetField = error.meta?.target || "unique field"; // Field causing the error (e.g., "email")
        const message = `A record with this ${targetField} already exists.`;
        console.error("Prisma Unique Constraint Error:", message);
        res.status(409).json({ error: message }); // 409 Conflict
      } else {
        // General Prisma errors
        console.error("Prisma Error:", error.message);
        res.status(500).json({
          error: "A database error occurred. Please try again later.",
        });
      }
    }
  }
};
