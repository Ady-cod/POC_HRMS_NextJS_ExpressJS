import { Request, Response } from "express";

import prisma from "../lib/client";
import { Prisma, Employee, Department } from "@prisma/client";

import { createEmployeeSchema } from "../schemas/employeeSchema";
import { z } from "zod";

import bcrypt from "bcrypt";  

// Infer type from Zod schema
type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;

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
              }
            }
          }
        },
        department: {
          select: {
            id: true,
            name: true, 
          }
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
    // Validate request body using Zod
    const validatedData: CreateEmployeeInput = createEmployeeSchema.parse(
      req.body
    );

    const { departmentName, password, ...employeeData } = validatedData;

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Find or create department
    let department = (await prisma.department.findUnique({
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
      password: hashedPassword,
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
        res
          .status(500)
          .json({
            error: "A database error occurred. Please try again later.",
          });
      }
    } else if (error instanceof Error) {
      // Handle known JavaScript errors
      console.error("Error creating employee:", error.message);
      res.status(500).json({ error: error.message });
    } else {
      // Fallback for unknown error types
      console.error("Unknown error:", error);
      res
        .status(500)
        .json({ error: "An unknown error occurred. Please try again later." });
    }
  }
};

export const updateEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Get the employee ID from route params

    if (!id) {
      res.status(400).json({ error: "Employee ID is required." });
      return;
    }

    const {
      fullName,
      email,
      password,
      country,
      city,
      streetAddress,
      phoneNumber,
      birthDate,
      dateOfJoining,
      gender,
      inductionCompleted,
      profilePhotoUrl,
      timezone,
      role,
      status,
      departmentId,
    }: CreateEmployeeInput = req.body;
    


    const updatedEmployeeData: CreateEmployeePrismaData = {
      fullName,
      email,
      password: password || null,
      country: country || null,
      city: city || null,
      streetAddress: streetAddress || null,
      phoneNumber: phoneNumber || null,
      birthDate: birthDate || null,
      dateOfJoining: dateOfJoining || null,
      gender: gender || EmployeeGender.OTHER,
      inductionCompleted: inductionCompleted ?? false,
      profilePhotoUrl: profilePhotoUrl || null,
      timezone: timezone || null,
      role: role || EmployeeRole.EMPLOYEE,
      status: status || EmployeeStatus.ACTIVE,
      departmentId: departmentId || null,
    };

    // Update the employee record
    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: updatedEmployeeData,
    });

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee:", error);

    if (error.code === "P2025") {
      // Prisma-specific error when no record is found
      res.status(404).json({ error: "Employee not found." });
    } else {
      res.status(500).json({ error: "Failed to update employee." });
    }
  }
};